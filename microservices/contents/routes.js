const { Router } = require('@finfluencers/shared');
const ContentService = require('@finfluencers/shared/services/Content.service');
const FeedController = require('./controllers/Feed.controller');
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
        const options = req.body || {};
        const posted = await ContentService.post(req.body, req.user);
	    if(!posted.hasOwnProperty('error')) res.json(Results.success(posted));
	    else res.json(Results.error(null, "Could not post content: "+posted.error));
    });

    routes.post('/feed', AuthenticationService.validate, async (req, res) => {
        const options = req.body || {};

        let feed;

        if(options.bookmarks){
			feed = await FeedController.bookmarks(req.user);
        } else {
	        let profile = options.hasOwnProperty('profile') ? !!options.profile : false;
	        feed = profile
		        ? await FeedController.profile(options, req.user)
		        : await FeedController.explore(options, req.user);
        }

        if(feed) return res.json(Results.success(feed));
        return res.json(Results.error(ERROR_TYPES.DATABASE, "Could not fetch feed"))
    });

    routes.get('/:id', AuthenticationService.validate, async (req, res) => {
        let content = await FeedController.getContent(req.params.id, req.user);

        if(content) return res.json(Results.success(content));
        return res.json(Results.error(ERROR_TYPES.DATABASE, "Could not find content"))
    });

	routes.post('/interact/:id', AuthenticationService.validate, async (req, res) => {
		const {type} = req.body || {};
		const interaction = await ContentService.interact(req.params.id, type, req.user);

		if(!interaction.hasOwnProperty('error')) res.json(Results.success(interaction));
		else res.json(Results.error(null, interaction.error));
	});

	routes.get('/delete/:id', AuthenticationService.validate, async (req, res) => {
		const deleted = await ContentService.delete(req.params.id, req.user);

		if(!deleted.hasOwnProperty('error')) res.json(Results.success(deleted));
		else res.json(Results.error(null, deleted.error));
	});

    return routes;
};
