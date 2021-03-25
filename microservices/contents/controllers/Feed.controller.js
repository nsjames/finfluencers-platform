const {results, ORM, couchbase} = require('@finfluencers/shared');
const Content = require('@finfluencers/shared/models/Content.model');
const {sha256} = require('@finfluencers/shared/utils/crypto.util');
const ContentService = require('@finfluencers/shared/services/Content.service');
const UserService = require('@finfluencers/shared/services/User.service');
const {INTERACTION_TYPE} = require('@finfluencers/shared/models/InteractionType');
const Interaction = require('@finfluencers/shared/models/Interaction.model');



module.exports = class FeedController {

    static async explore(options, user){
	    const contents = await ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'content' ORDER BY created_at DESC LIMIT 50`, Content);
	    await ContentService.prepareContent(contents, user);
	    return contents;
    }

    static async profile(options, user){
	    const contents = await ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'content' AND user_id = '${options.profile}' ORDER BY created_at DESC LIMIT 50`, Content);
	    await ContentService.prepareContent(contents, user);
	    return contents;
    }

    static async getContent(id, user){
    	const content = await ContentService.getById(id);
    	if(!content) return null;

    	await ContentService.prepareContent([content], user);

    	return content;
    }

}
