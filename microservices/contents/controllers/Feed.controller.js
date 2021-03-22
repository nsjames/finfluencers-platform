const {results, ORM, couchbase} = require('@finfluencers/shared');
const Content = require('@finfluencers/shared/models/Content.model');
const {sha256} = require('@finfluencers/shared/utils/crypto.util');
const BlockchainService = require('@finfluencers/shared/services/Blockchain.service');
const UserService = require('@finfluencers/shared/services/User.service');

const prepareContent = async contents => {
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
}

module.exports = class FeedController {

    static async explore(options){
	    const contents = await ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'content' ORDER BY created_at DESC LIMIT 50`, Content);
	    await prepareContent(contents);
	    return contents;
    }

    static async profile(options){
	    const contents = await ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'content' AND user_id = '${options.profile}' ORDER BY created_at DESC LIMIT 50`, Content);
	    await prepareContent(contents);
	    return contents;
    }

}
