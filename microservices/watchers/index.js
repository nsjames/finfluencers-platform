const {createServer, ORM} = require('@finfluencers/shared');
const routeGenerator = require('./routes');
const Watchable = require('@finfluencers/shared/models/Watchable.model');
// const Validatable = require('@finfluencers/shared/models/Validatable.model');
const MessageQueueService = require('@finfluencers/shared/services/MessageQueue.service');
// const UserService = require('@finfluencers/shared/services/User.service');
// const ValidationService = require('@finfluencers/shared/services/Validation.service');
// const logger = require('../../utilities/logger');
const PQueue = require('p-queue').default;
const assignQueue = new PQueue({concurrency: 2});
const watchableQueue = new PQueue({concurrency: 2});

const server = createServer(process.env.PORT || null, routeGenerator);

// let intervals = [];
// if(global.clearIntervals) global.clearIntervals();

// MessageQueueService.watchTopic('validations', async validation => {
//     validation = JSON.parse(validation);
//     logger.debug(`MessageQueueService topic: 'validations'`, JSON.stringify(validation, null, 4));
// 	await Promise.all([
// 		UserService.releaseUser(validation.user),
// 		UserService.addExperience(validation.user),
// 		ValidationService.addEarnings(validation.user, validation.request)
// 	]);
//     return true;
// })
//
// // When starting, could be existing validatable that need assigning
// const checkValidatables = async () => {
// 	const now = +new Date();
// 	const validatables = await ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'validatable' AND done = false`, Validatable);
// 	if(!validatables || !validatables.length) return;
//
// 	console.log('Found validatables: ', validatables.length);
//
// 	await Promise.all(validatables.map(validatable => {
// 		return MessageQueueService.emit(`validatable`, validatable.id);
// 	}));
// };
// checkValidatables();
//
// MessageQueueService.watchTopic('validatable', async validatable_id => {
// 	assignQueue.add(async() => {
// 		logger.debug(`MessageQueueService topic: 'validatable'`, validatable_id);
// 		const validated = await ValidationService.assign(validatable_id);
// 		if(!validated){
// 			// Couldn't find validators, try again in 20 seconds.
// 			await new Promise(r => setTimeout(r, 1000*20));
// 			await MessageQueueService.emit('validatable', validatable_id);
// 		}
// 	});
//
//     return true;
// });
//
// MessageQueueService.watchTopic('validation::success', async validatable_id => {
//     logger.debug(`MessageQueueService topic: 'validation::success'`, validatable_id);
//     const validatable = await ValidationService.getValidatable(validatable_id);
//     if(!validatable) return;
// 	await ValidationService.sendWebhooks(validatable);
// 	await ValidationService.chargeApiKey(validatable);
//     return true;
// });
//
// MessageQueueService.watchTopic('socialauth', async social_auth => {
//     logger.debug(`MessageQueueService topic: 'socialauth'`, social_auth);
//     return true;
// });
//
// intervals.push(setInterval(async () => {
//     const now = +new Date();
//     const watchables = await ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'watchable' AND \`last_checked\` < ${now} - \`interval\``, Watchable);
//     if(!watchables || !watchables.length) return;
//
// 	console.log('Found watchables: ', watchables.length);
//
// 	watchables.map(watchable => {
// 		watchableQueue.add(() => MessageQueueService.emit(`watchable:${watchable.platform_type}`, watchable.index()));
// 	})
//
// }, 1000));
//
// intervals.push(setInterval(async () => {
// 	ValidationService.removeStaleValidationRequests();
// }, 1000));
//
// // Used for auto-reload from the `runner/run.js` script so that we
// // arent slowly building up infinite interval loops every time a service
// // is reloaded.
// global.clearIntervals = async () => {
// 	intervals.map(x => clearInterval(x));
// 	intervals = [];
// 	await MessageQueueService.clearSockets();
// }




module.exports = server;


