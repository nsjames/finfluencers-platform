const { Router } = require('@finfluencers/shared');
const CommentController = require('./controllers/Comment.controller');
const Results = require("@finfluencers/shared/models/Results.model");
const {ERROR_TYPES} = require("@finfluencers/shared/models/Results.model");
const AuthenticationService = require('@finfluencers/shared/services/Authentication.service');

const senderIp = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress;

module.exports = () => {
    const routes = Router();

    routes.get('/health', async (req, res) => {
        res.json('ok');
    });

    routes.post('/', AuthenticationService.validate, async (req, res) => {
        const comment = req.body || {};
        const posted = await CommentController.post(comment, req.user);
	    if(!posted.hasOwnProperty('error')) res.json(Results.success(posted));
	    else res.json(Results.error(null, "Could not post content: "+posted.error));
    });

    routes.get('/:parent', AuthenticationService.validate, async (req, res) => {
        let comments = await CommentController.getCommentChain(req.params.parent);
        if(comments) return res.json(Results.success(comments));
        return res.json(Results.error(ERROR_TYPES.DATABASE, "Could not find comments for: "+req.params.parent));
    });

    return routes;
};
