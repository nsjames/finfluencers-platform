const {createServer} = require('@finfluencers/shared');
const routeGenerator = require('./routes');

const server = createServer(process.env.PORT || null, routeGenerator)

module.exports = server;
