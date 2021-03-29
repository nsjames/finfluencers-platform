const {results, ORM, couchbase} = require('@finfluencers/shared');
const Comment = require('@finfluencers/shared/models/Comment.model');
const Interaction = require('@finfluencers/shared/models/Interaction.model');
const {INTERACTION_TYPE} = require('@finfluencers/shared/models/InteractionType');
const UserService = require('@finfluencers/shared/services/User.service');
const ContentService = require('@finfluencers/shared/services/Content.service');
const uuid = require('@finfluencers/shared/utils/uuid.util');
const {sha256} = require('@finfluencers/shared/utils/crypto.util');

const prepareComment = async comments => {
	const users = {};
	await Promise.all(comments.map(async comment => {
		if(!users.hasOwnProperty(comment.user_id) || !users[comment.user_id]) {
			users[comment.user_id] = await UserService.getById(comment.user_id);
		}
		if(!users[comment.user_id]) return;
		comment.user = users[comment.user_id].safer();
	}));
};

module.exports = class CommentController {

    static async post(comment, user){

	    const checkParent = async (parentType, parentId) => {
		    let found;
		    switch(parentType){
			    case 'content': found = await ContentService.getById(parentId); break;
			    case 'comment': found = await this.getById(parentId); break;
		    }
		    return !!found;
	    };

	    try {
	    	comment.user_id = user.id;

		    let id = uuid();
		    while(!!await CommentController.getById(id).catch((() => false))) id = uuid();
		    comment.id = id;

		    comment = new Comment(comment);
		    comment.created_at = +new Date();

			if(!await checkParent(comment.parentType(), comment.parentId())){
				return {error:"Could not find comment's parent"};
			}

			if(!await checkParent(comment.topLevelParentType(), comment.topLevelParentId())){
				return {error:"Could not find comment's parent"};
			}

			if(comment.resolution !== ''){
				if(comment.topLevelParentType() === 'content'){
					const content = await ContentService.getById(comment.topLevelParentId());
					if(content.user_id === user.id){
						comment.resolution = '';
					} else {
						const interaction = new Interaction({
							// Will fail to insert this if previous interaction already exists
							id:sha256(`${content.id}:${user.id}:${INTERACTION_TYPE.CONTENT_RESOLUTION}`),
							user_id:user.id,
							parent_index:content.id,
							parent_owner_id:content.user_id,
							type:INTERACTION_TYPE.CONTENT_RESOLUTION,
							data:comment.resolution === 'helped' ? 1 : -1,
						});

						await ORM.upsert(interaction);
					}
				} else {
					comment.resolution = '';
				}
			}


		    // TODO: Post to blockchain

		    const posted = await ORM.insert(comment);

		    comment.user = user.safer();

		    return comment;
	    } catch(e){
	    	console.error("Error posting comment", e);
	    	return {error:e.toString().split('{')[0]};
	    }
    }

    static async getById(id){
    	const comment = new Comment({id});
    	return ORM.get(comment.index(), Comment).catch(err => {
    		// console.error("Error getting comment", id, err);
    		return null;
	    })
    }

    static async getCommentChain(parent_index, limit = 100, offset = 0){
    	const comments = await ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'comment' AND parent_index = '${parent_index}' ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, Comment);

    	await prepareComment(comments);
	    await Promise.all(comments.map(async comment => {
	    	comment.comments = await this.getCommentChain(`comment:${comment.id}`, 5);
	    }));

    	return comments;
    }

	static async getInteractions(){

	}

}
