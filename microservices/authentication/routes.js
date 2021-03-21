const { Router } = require('@finfluencers/shared');
const AuthenticationService = require('@finfluencers/shared/services/Authentication.service');

const senderIp = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress;

const Results = require('@finfluencers/shared/models/Results.model');

module.exports = () => {
    const routes = Router();

    routes.get('/health', async (req, res) => {
        res.json('ok');
    });

    routes.get('/authenticate', AuthenticationService.validate, async (req, res) => {
        res.json(Results.success(req.user.safe()));
    });

    routes.post('/authenticate', async (req, res) => {
        const {email, pass} = req.body;
        return res.json(await AuthenticationService.createToken(email, pass, senderIp(req)));
    });

    return routes;
};
