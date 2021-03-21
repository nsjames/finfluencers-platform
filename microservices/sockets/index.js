const {createSocket} = require('@finfluencers/shared');

const wss = createSocket(process.env.PORT || null, (message, ws) => {
	console.log('wss message', message);
});

module.exports = wss;
