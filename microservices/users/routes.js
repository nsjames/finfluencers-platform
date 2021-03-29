const Results = require("@finfluencers/shared/models/Results.model");
const {ERROR_TYPES} = require("@finfluencers/shared/models/Results.model");

const { Router } = require('@finfluencers/shared');

const UserController = require('./controllers/User.controller');
const AuthenticationService = require('@finfluencers/shared/services/Authentication.service');
const BlockchainService = require('@finfluencers/shared/services/Blockchain.service');

const senderIp = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress;

module.exports = () => {
    const routes = Router();

    routes.get('/health', async (req, res) => {
        res.json('ok');
    });

    routes.get('/find-code/:code', async (req, res) => {
        const found = await BlockchainService.checkActivationCode(req.params.code);
	    res.json(Results.success(!!found));
    });

    routes.post('/register', async (req, res) => {
        res.json(await UserController.insert(req.body));
    });

    routes.get('/user', AuthenticationService.validate, async (req, res) => {
        // Can only get your own user
        res.json(Results.success(await UserController.getSelfUser(req.user)));
    });

    routes.get('/user/:name', AuthenticationService.validate, async (req, res) => {
        const user = await UserController.find(decodeURIComponent(req.params.name), req.user);
        if(user) res.json(Results.success(user));
        else res.json(Results.error(ERROR_TYPES.DATABASE, `User (${req.params.name}) could not be found`))
    });

    routes.get('/touch', AuthenticationService.validate, async (req, res) => {
        const touched = await UserController.touch(req.user);
        if(touched) res.json(Results.success(true));
        else res.json(Results.error(null, "Could not update the user's last connection time"));
    });

    routes.get('/quit', AuthenticationService.validate, async (req, res) => {
        const touched = await UserController.touch(req.user, true);
        if(touched) res.json(Results.success(true));
        else res.json(Results.error(null, "Could not quit validation connection"));
    });

    routes.get('/subscribe/:id', AuthenticationService.validate, async (req, res) => {
        const subscribed = await UserController.subscribe(req.params.id, req.user);
        console.log('subscribed', subscribed);

	    if(!subscribed.hasOwnProperty('error')) res.json(Results.success(subscribed));
	    else res.json(Results.error(null, "Could not post content: "+subscribed.error));
    });

    return routes;
};
