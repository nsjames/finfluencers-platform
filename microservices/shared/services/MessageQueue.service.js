const uuid = require('../utils/uuid.util');
const ORM = require('../orm');
const MessageQueue = require('../models/MessageQueue.model');
const {sha256} = require('../utils/crypto.util');
const couchbase = require('couchbase');
const zmq = require("zeromq")
const PQueue = require('p-queue').default;
const queue = new PQueue({concurrency: 1});

const ZMQ_HOST = "tcp://127.0.0.1";

let initialized = false;

// Each topic is on a different port
// This is deterministic and no two topics should
// have the same port.
const topicToPort = topic => {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
	let port = 20000;
	for(let i = 0; i < topic.length; i++){
		port += alphabet.indexOf(topic[i].toLowerCase());
	}
	// console.log('Topic to port', topic, port);
	return port;
};

let sockCache = {};

const SOCKET_TYPES = {
	PUSH:'push',
	PULL:'pull'
}

module.exports = class MessageQueueService {

	static async clearSockets(){
		console.log('Clearing message queue sockets')
		await Promise.all(Object.keys(sockCache).map(async key => {
			try {
				const [topic, type] = key.split('||');
				if(type === SOCKET_TYPES.PUSH) await sockCache[key].unbind(`${ZMQ_HOST}:${topicToPort(topic)}`);
				if(type === SOCKET_TYPES.PULL) await sockCache[key].disconnect(`${ZMQ_HOST}:${topicToPort(topic)}`);
				sockCache[key].close();
				await new Promise(r => setTimeout(r, 1000));
			} catch(e){
				console.error("Error clearing socket", e);
			}
			delete sockCache[key];
		}));



		return true;
	}

	static async getSocket(topic, type){
		const key = `${topic}||${type}`;
		if(sockCache[key]) return sockCache[key];
		const sock = type === SOCKET_TYPES.PUSH ? new zmq.Push() : new zmq.Pull();
		if(type === SOCKET_TYPES.PUSH) await sock.bind(`${ZMQ_HOST}:${topicToPort(topic)}`);
		if(type === SOCKET_TYPES.PULL) await sock.connect(`${ZMQ_HOST}:${topicToPort(topic)}`);
		sockCache[key] = sock;
		return sock;
	}

    static async emit(topic, data = null){
		// We can only send one message through the socket at a time, so we need to wait.
	    queue.add(async () => {
		    try {
			    const sock = await MessageQueueService.getSocket(topic, SOCKET_TYPES.PUSH);
			    const message = new MessageQueue({ topic, data });
			    await sock.send(JSON.stringify(message));
		    } catch(e){
		    	console.error("Socket is dead", e);
		    }
	    })
    }

    static async watchTopic(topic, handler = () => {}){
	    const sock = await MessageQueueService.getSocket(topic, SOCKET_TYPES.PULL);
	    try {
		    for await (const raw_message of sock) {
			    try { handler(JSON.parse(raw_message.toString()).data); }
			    catch(e){ console.error("Error parsing mq json", e); }
		    }
	    } catch(e){
	    	console.error("Watch topic error", e);
	    }
    }

}
