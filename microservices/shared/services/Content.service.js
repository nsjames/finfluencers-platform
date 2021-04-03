

const {INTERACTION_TYPE} = require("../models/InteractionType");
const {CONTENT_TYPE} = require('../models/ContentType');

const ORM = require('../orm');
const couchbase = require('couchbase');
const Content = require('../models/Content.model');
const TokenPrice = require('../models/TokenPrice.model');
const Interaction = require('../models/Interaction.model');
const UserService = require('../services/User.service');
const InteractionService = require('../services/Interaction.service');
const TokenService = require('../services/Token.service');
const uuid = require('../utils/uuid.util');
const {sha256} = require('../utils/crypto.util');
const {historicalPriceQuery} = require("../queries");

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

			if(content.type === CONTENT_TYPE.PREDICTION){
				const thirtyDaysBefore = content.data.date - 86400*1000*30;
				content.data.historical_prices = await TokenService.getPriceHistory(content.data.asset.id, thirtyDaysBefore, content.data.date);
				content.data.historical_prices = content.data.historical_prices.map(x => {
					x.price = parseFloat(x.price);
					return x;
				});

				if(content.data.historical_prices.length && content.data.historical_prices.length < 30){
					// for(let i = 0; i < 30 - content.data.historical_prices.length; i++){
					// 	content.data.historical_prices.push({
					// 		id:content.data.historical_prices[0].id,
					// 		price:content.data.historical_prices[0].price - (content.data.historical_prices[0].price / 5) + Math.round(Math.random() * content.data.historical_prices[0].price / 4),
					// 		date:content.data.historical_prices[0].date - (86400*1000*i)
					// 	});
					// }

					content.data.historical_prices = content.data.historical_prices.sort((a,b) => {
						if(b.date > a.date) return -1;
						if(b.date < a.date) return 1;
						return 0;
					});

				}
			}
		}));
	}

    static async post(json, user){
        try {
	        if(json.user_id !== user.id) return {error:`Content posted from wrong user ID`};
	        if(!json.created_at || json.created_at < (+new Date() - 30*1000) || json.created_at > (+new Date() + 30*1000))
	        	return {error:`Content date is not valid`};

        	let id = uuid();
	        while(!!await ContentService.getById(id, true).catch((() => false))) id = uuid();


	        const content = new Content(Object.assign(json, {id}));

	        switch(content.type){
		        case CONTENT_TYPE.PREDICTION:
		        	if(!content.data.asset.id) return {error:"Invalid asset"};


		        	console.log('content', content);
			        let prices = await ORM.query(historicalPriceQuery(content, content.created_at - (86400000), content.created_at + (86400000)), TokenPrice)
			        if(!prices || !prices.length) return {error:"Could not get a price for this prediction, please try again"};
			        const priceAtStart = prices.reduce((acc,x) => {
				        if(x.date >= acc.date && acc.date <= content.created_at) return x;
				        return acc;
			        });

			        content.data.predicted_outcome = parseFloat((content.data.price-priceAtStart.price)/content.data.price*100.0);
			        content.data.starting_price = priceAtStart.price;

		        	break;

		        case CONTENT_TYPE.TRADE:
		        	if(!content.data.from.id) return {error:"Invalid from asset"};
		        	if(!content.data.to.id) return {error:"Invalid to asset"};
		        	break;

	        }

	        if(!content.text.data.length) return {error:`You can't post empty text content`};

	        // TODO: Add to blockchain

	        const posted = await ORM.insert(content);

	        content.user = (await UserService.getById(user.id)).safer();

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

		const parent_index = `content:${id}`;
		if(type !== INTERACTION_TYPE.HEART && type !== INTERACTION_TYPE.BOOKMARK){
			return {error:"Invalid interaction type"};
		}

		const content = await this.getById(id);
		if(!content) return {error:"Content ID does not exist"};

		if(content.user_id === user.id){
			return {error:"Can't interact with your own content"};
		}

		const shaID = sha256(`${parent_index}:${user.id}:${type}`);
		const index = (new Interaction({id:shaID})).index();

		if(await ORM.exists(index)){
			await InteractionService.removeInteraction(shaID, content.user_id);
			return {};
		}

		const saved = await InteractionService.addInteraction(
			shaID,
			user.id,
			parent_index,
			content.user_id,
			type,
		);

		return saved ? saved : {error:"Error saving interaction"};
	}

	static async delete(content_id, user){
		const content = await this.getById(content_id).catch(err => {
			console.error("Delete content fetch error", err);
			return null;
		});
		if(!content) return {error:"Could not find content to delete"};

		if(content.user_id !== user.id) return {error:"You cannot delete content you did not create"};

		if(content.type === CONTENT_TYPE.PREDICTION){
			const timeDiff = content.data.date - content.created_at;
			const halfLife = (content.data.date + (timeDiff/2));
			const hasReachedHalfLife = +new Date() > halfLife;
			if (hasReachedHalfLife && !content.data.applied) {
				return {error: "Predictions can only be deleted when they haven't yet reached 50% of the completion date"};
			}
		}

		// Deleting all bookmarks.
		// TODO: Should we delete all interactions?
		await ORM.query(`DELETE FROM BUCKET_NAME WHERE doc_type = 'interaction' AND type = ${INTERACTION_TYPE.BOOKMARK} AND parent_index = 'content:${content.id}'`);


		return ORM.getBucket().mutateIn(content.index(), [
			couchbase.MutateInSpec.upsert("soft_delete", 1),
		]).catch(err => {
			console.error("Content soft delete error", err);
			return false;
		}).then(async x => {
			return true;
		});
	}

}
