const Results = require("@finfluencers/shared/models/Results.model");

const { Router } = require('@finfluencers/shared');

const UserController = require('./controllers/User.controller');
const AuthenticationService = require('@finfluencers/shared/services/Authentication.service');

const senderIp = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress;

module.exports = () => {
    const routes = Router();

    routes.get('/health', async (req, res) => {
        res.json('ok');
    });

    routes.post('/register', async (req, res) => {
        res.json(await UserController.insert(req.body));
    });

    routes.get('/user', AuthenticationService.validate, async (req, res) => {
        // Can only get your own user
        res.json(Results.success(req.user.safe()));
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

    return routes;
};
