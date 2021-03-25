const {INTERACTION_TYPE} = require("../models/InteractionType");

const ORM = require('../orm');
const couchbase = require('couchbase');
const Content = require('../models/Content.model');
const Interaction = require('../models/Interaction.model');
const UserService = require('../services/User.service');
const uuid = require('../utils/uuid.util');
const {sha256} = require('../utils/crypto.util');

// TODO: Left join these?
const COMMENT_TRACKER_QUERY = (content) =>
	`SELECT COUNT(*) FROM BUCKET_NAME WHERE doc_type = 'comment' AND top_level_parent_index = 'content:${content.id}'`;
const HEART_TRACKER_QUERY = (content) =>
	`SELECT COUNT(*) FROM BUCKET_NAME WHERE doc_type = 'interaction' AND parent_index = 'content:${content.id}' AND type = ${INTERACTION_TYPE.HEART}`;
const INTERACTIONS_QUERY = (content, user) =>
	`SELECT * FROM BUCKET_NAME WHERE doc_type = 'interaction' AND parent_index = 'content:${content.id}' AND user_id = '${user.id}'`;

module.exports = class ContentService {

	static async prepareContent(contents, user){
		const users = {};
		await Promise.all(contents.map(async content => {
			if(!users.hasOwnProperty(content.user_id) || !users[content.user_id]) {
				users[content.user_id] = await UserService.getById(content.user_id);
			}
			if(!users[content.user_id]) return;
			content.user = users[content.user_id].safer();

			content.trackers = {};
			content.trackers.comments = await ORM.query(COMMENT_TRACKER_QUERY(content));
			content.trackers.hearts = await ORM.query(HEART_TRACKER_QUERY(content));
			content.interactions = await ORM.query(INTERACTIONS_QUERY(content, user), Interaction);
		}));
	}

    static async post(json, user){
        try {
	        json.user_id = user.id;

        	let id = uuid();
	        while(!!await ContentService.getById(id, true).catch((() => false))) id = uuid();


	        const content = new Content(Object.assign(json, {id}));
	        content.created_at = +new Date();

	        if(!content.text.data.length) return {error:`You can't post empty text content`};

	        // TODO: Add to blockchain

	        const posted = await ORM.insert(content);

	        content.user = user.safer();

	        await this.prepareContent([content], user);
	        return content;
        } catch(err){
        	console.error("Post content error", err);
        	return {error:err.toString().split('{')[0]};
        }
    }

	static async getById(id, swallowError = false){
		try {
			const content = new Content({id});
			return ORM.get(content.index(), Content).catch(err => {
				if(!swallowError) console.error("Get by id error: ", err);
				return null;
			});
		} catch(e){
			console.error('Content service get by id error', e);
			return null;
		}
	}

	static async interact(id, type, user){
    	// TODO: Add blockchain here

		const parent_index = `content:${id}`;
		if(!Object.keys(INTERACTION_TYPE).map(x => INTERACTION_TYPE[x]).includes(type)){
			return {error:"Invalid interaction type"};
		}

		const content = await this.getById(id);
		if(!content) return {error:"Content ID does not exist"};

		const interaction = new Interaction({
			// Will fail to insert this if previous interaction already exists
			id:sha256(`${parent_index}:${user.id}:${type}`),
			user_id:user.id,
			parent_index,
			parent_owner_id:content.user_id,
			type,
			data:null,
		});

		if(await ORM.exists(interaction.index())){
			if(type === INTERACTION_TYPE.HEART){
				await ORM.remove(interaction.index());
				return {};
			}
			return {error:"You have already done this interaction"};
		}

		const saved = await ORM.insert(interaction).catch(() => null);
		if(!saved) return {error:"Error saving interaction"};

		return interaction;
	}

}
