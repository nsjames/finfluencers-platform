const {results, ORM, couchbase} = require('@finfluencers/shared');
const Content = require('@finfluencers/shared/models/Content.model');
const {CONTENT_TYPE} = require('@finfluencers/shared/models/ContentType');
const {sha256} = require('@finfluencers/shared/utils/crypto.util');
const ContentService = require('@finfluencers/shared/services/Content.service');
const UserService = require('@finfluencers/shared/services/User.service');
const {INTERACTION_TYPE} = require('@finfluencers/shared/models/InteractionType');
const Interaction = require('@finfluencers/shared/models/Interaction.model');



module.exports = class FeedController {

    static async explore(options, user){
    	let typeQuery;
    	if(options.feedType === 0){
		    // Learn
		    typeQuery = `AND type IN [${CONTENT_TYPE.KNOWLEDGE}, ${CONTENT_TYPE.PREDICTION}, ${CONTENT_TYPE.TRADE}]`
	    } else {
		    // Influence
		    typeQuery = `AND type IN [${CONTENT_TYPE.SET_GOAL}, ${CONTENT_TYPE.GET_HELP}]`
	    }
	    const contents = await ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'content' AND soft_delete = 0 ${typeQuery} ORDER BY created_at DESC LIMIT 50`, Content);
	    await ContentService.prepareContent(contents, user);
	    return contents;
    }

    static async profile(options, user){
	    const contents = await ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'content' AND soft_delete = 0 AND user_id = '${options.profile}' ORDER BY created_at DESC LIMIT 50`, Content);
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
