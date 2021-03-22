const {results, ORM, couchbase} = require('@finfluencers/shared');
const Content = require('@finfluencers/shared/models/Content.model');
const {sha256} = require('@finfluencers/shared/utils/crypto.util');
const BlockchainService = require('@finfluencers/shared/services/Blockchain.service');
const UserService = require('@finfluencers/shared/services/User.service');

module.exports = class FeedController {

    static async explore(options){
	    const contents = await ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'content' ORDER BY created_at DESC LIMIT 50`, Content);

	    const users = {};
	    await Promise.all(contents.map(async content => {
	        if(!users.hasOwnProperty(content.user_id) || !users[content.user_id]) {
	            users[content.user_id] = await UserService.getById(content.user_id);
	        }
	        if(!users[content.user_id]) return;
	        content.user = {
	            id:users[content.user_id].id,
	            name:users[content.user_id].name,
	            wealth:users[content.user_id].wealth,
            }
        }));

	    return contents;
    }

    static async profile(options){

    }

}
