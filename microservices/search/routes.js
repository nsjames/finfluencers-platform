const { Router } = require('@finfluencers/shared');
const TokenService = require('@finfluencers/shared/services/Token.service');
const AuthenticationService = require('@finfluencers/shared/services/Authentication.service');
const SearchService = require('@finfluencers/shared/services/Search.service');
const Results = require("@finfluencers/shared/models/Results.model");
const {ERROR_TYPES} = require("@finfluencers/shared/models/Results.model");

const senderIp = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress;

module.exports = () => {
    const routes = Router();

    routes.get('/health', async (req, res) => {
        res.json('ok');
    });

    routes.get('/tokens/:term', AuthenticationService.validate, async (req, res) => {
        const found = await TokenService.search(decodeURIComponent(req.params.term));
	    res.json(Results.success(found));
    });

    routes.get('/terms/:term', AuthenticationService.validate, async (req, res) => {
        const found = await SearchService.search(decodeURIComponent(req.params.term));
	    res.json(Results.success(found));
    });

    return routes;
};
