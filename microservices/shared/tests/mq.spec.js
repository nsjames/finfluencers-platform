// const { assert } = require('../../../utilities/assert');
//
// const MessageQueueService = require('../services/MessageQueue.service');
//
// describe('MQ', () => {
//
//
//     it('should be able to setup a listener and emit a message', done => {
//         new Promise(async() => {
//             const timestamp = (+new Date()).toString();
//             MessageQueueService.watchTopic('finfluencers', message => {
//                 assert(message === timestamp, "Did not get the correct message");
//                 done();
//             });
//             await MessageQueueService.emit('finfluencers', timestamp)
//         });
//     });
//
//     it('should be able to send many concurrent requests', done => {
//         new Promise(async() => {
//             const timestamp = (+new Date()).toString();
//             let received = 0;
//             MessageQueueService.watchTopic('speed', message => {
// 	            received++;
//                 if(received === 1000) done();
//             });
//             [...Array(1000).keys()].map(async i => {
// 	            await MessageQueueService.emit('speed', timestamp)
//             });
//         });
//     });
//
//
// });
