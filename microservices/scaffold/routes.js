const { Router } = require('@finfluencers/shared');

const senderIp = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress;

module.exports = () => {
    const routes = Router();

    routes.get('/health', async (req, res) => {
        res.json('ok');
    });

    routes.post('/', async (req, res) => {
        const options = req.body || {};
        res.json(true);
    });

    return routes;
};
