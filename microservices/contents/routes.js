const { Router } = require('@finfluencers/shared');
const ContentService = require('@finfluencers/shared/services/Content.service');
const FeedController = require('./controllers/Feed.controller');
const Results = require("@finfluencers/shared/models/Results.model");
const {ERROR_TYPES} = require("@finfluencers/shared/models/Results.model");

const senderIp = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress;

module.exports = () => {
    const routes = Router();

    routes.get('/health', async (req, res) => {
        res.json('ok');
    });

    routes.post('/', async (req, res) => {
        const options = req.body || {};
        const posted = await ContentService.post(req.body);
	    if(!posted.hasOwnProperty('error')) res.json(Results.success(posted));
	    else res.json(Results.error(null, "Could not post content: "+posted.error));
    });

    routes.post('/feed', async (req, res) => {
        const options = req.body || {};
        let explore = options.hasOwnProperty('profile') ? !!options.profile : true;
        const feed = explore
	        ? await FeedController.explore(options)
	        : await FeedController.profile(options);

        if(feed) return res.json(Results.success(feed));
        return res.json(Results.error(ERROR_TYPES.DATABASE, "Could not fetch feed"))
    });

    return routes;
};
