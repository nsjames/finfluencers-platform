const {createServer, ORM} = require('@finfluencers/shared');
const routeGenerator = require('./routes');
const Watchable = require('@finfluencers/shared/models/Watchable.model');
const MessageQueueService = require('@finfluencers/shared/services/MessageQueue.service');
const TokenService = require('@finfluencers/shared/services/Token.service');
const PredictionService = require('@finfluencers/shared/services/Prediction.service');
// const logger = require('../../utilities/logger');
const PQueue = require('p-queue').default;
const assignQueue = new PQueue({concurrency: 2});
const watchableQueue = new PQueue({concurrency: 2});

const server = createServer(process.env.PORT || null, routeGenerator);

let intervals = [];
if(global.clearIntervals) global.clearIntervals();

const callAndSetWatcher = (fn, time) => {
	fn();
	intervals.push(setInterval(fn, time));
}

callAndSetWatcher(async () => {
	await TokenService.cacheTokenList();
}, 60*30*1000);

callAndSetWatcher(async () => {
	MessageQueueService.emit('check-predictions');
}, 60*2*1000);

MessageQueueService.watchTopic('check-predictions', async content => {
	return PredictionService.checkPredictions();
});

MessageQueueService.watchTopic('resolve-prediction', async content => {
	return PredictionService.resolvePrediction(content);
});

// Used for auto-reload from the `runner/run.js` script so that we
// arent slowly building up infinite interval loops every time a service
// is reloaded.
global.clearIntervals = async () => {
	intervals.map(x => clearInterval(x));
	intervals = [];
	await MessageQueueService.clearSockets();
}




module.exports = server;


