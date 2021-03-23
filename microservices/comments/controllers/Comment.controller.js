const {results, ORM, couchbase} = require('@finfluencers/shared');
const Comment = require('@finfluencers/shared/models/Comment.model');
const UserService = require('@finfluencers/shared/services/User.service');
const ContentService = require('@finfluencers/shared/services/Content.service');
const uuid = require('@finfluencers/shared/utils/uuid.util');

const prepareComment = async comments => {
	const users = {};
	await Promise.all(comments.map(async comment => {
		if(!users.hasOwnProperty(comment.user_id) || !users[comment.user_id]) {
			users[comment.user_id] = await UserService.getById(comment.user_id);
		}
		if(!users[comment.user_id]) return;
		comment.user = users[comment.user_id].safer();
	}));
}

module.exports = class CommentController {

    static async post(comment, user){
	    try {
	    	comment.user_id = user.id;
		    comment.commentCount = 0;

		    let id = uuid();
		    while(!!await CommentController.getById(id).catch((() => false))) id = uuid();
		    comment.id = id;

		    comment = new Comment(comment);
		    comment.created_at = +new Date();

		    let found;
		    switch(comment.parentType()){
			    case 'content': found = await ContentService.getById(comment.parentId()); break;
			    case 'comment': found = await this.getById(comment.parentId()); break;
		    }

		    if(!found) return {error:"Could not find comment's parent"};

		    // TODO: Post to blockchain

		    const posted = await ORM.insert(comment);

		    // Incrementing quick-access counters
		    switch(comment.parentType()){
			    case 'content': await ContentService.incrementCommentCount(comment.parentId()); break;
			    case 'comment': await this.incrementCommentCount(comment.parentId()); break;
		    }

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
	    console.log('comments', comments);
	    await Promise.all(comments.map(async comment => {
	    	comment.comments = await this.getCommentChain(`comment:${comment.id}`, 5);
	    }));

    	return comments;
    }

	static async incrementCommentCount(id){
    	const comment = new Comment({id});
		return ORM.getBucket().mutateIn(comment.index(), [
			couchbase.MutateInSpec.increment("commentCount", 1),
		]).catch(err => {
			console.error("increment comments error", id, err);
			return false;
		}).then(x => {
			return true;
		});
	}

}
