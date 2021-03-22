const ORM = require('../orm');
const Content = require('../models/Content.model');
const UserService = require('../services/User.service');
const uuid = require('../utils/uuid.util');


module.exports = class ContentService {

    static async post(json){
        try {
        	const user = await UserService.getById(json.user_id);
        	if(!user) return {error:'Could not find user'};

        	let id = uuid();
	        while(!!await ContentService.getById(id).catch((() => false))) id = uuid();


	        const content = new Content(Object.assign(json, {id, created_at:+new Date(), wealth:user.wealth}));

	        if(!content.text.data.length) return {error:`You can't post empty text content`};

	        // TODO: Add to blockchain

	        const posted = await ORM.insert(content);

	        return content;
        } catch(err){
        	console.error("Post content error", err);
        	return {error:err.toString().split('{')[0]};
        }
    }

	static async getById(id){
		try {
			const content = new Content({id});
			return ORM.get(content.index(), Content);
		} catch(e){
			console.error('Content service get by id error', e);
			return null;
		}
	}

}
