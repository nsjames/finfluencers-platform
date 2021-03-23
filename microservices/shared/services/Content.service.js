const ORM = require('../orm');
const couchbase = require('couchbase');
const Content = require('../models/Content.model');
const UserService = require('../services/User.service');
const uuid = require('../utils/uuid.util');


module.exports = class ContentService {

    static async post(json, user){
        try {
	        json.user_id = user.id;

        	let id = uuid();
	        while(!!await ContentService.getById(id).catch((() => false))) id = uuid();


	        const content = new Content(Object.assign(json, {id, wealth:user.wealth}));
	        content.created_at = +new Date();
	        content.commentCount = 0;

	        if(!content.text.data.length) return {error:`You can't post empty text content`};

	        // TODO: Add to blockchain

	        const posted = await ORM.insert(content);

	        content.user = user.safer();

	        return content;
        } catch(err){
        	console.error("Post content error", err);
        	return {error:err.toString().split('{')[0]};
        }
    }

	static async getById(id){
		try {
			const content = new Content({id});
			return ORM.get(content.index(), Content).catch(err => {
				console.error("Get by id error: ", err);
				return null;
			});
		} catch(e){
			console.error('Content service get by id error', e);
			return null;
		}
	}

	static async incrementCommentCount(id){
		const content = new Content({id});
		return ORM.getBucket().mutateIn(content.index(), [
			couchbase.MutateInSpec.increment("commentCount", 1),
		]).catch(err => {
			console.error("increment content comments error", id, err);
			return false;
		}).then(x => {
			return true;
		});
	}

}
