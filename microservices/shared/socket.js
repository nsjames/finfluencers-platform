const WebSocket = require('ws');
const getPort = require('get-port');

/***
 * Creates a WebSocket server
 * @param port
 * @param messageHandler
 */
const createSocket = async (port, messageHandler) => {
    if(!port) port = await getPort({port: getPort.makeRange(60506, 61516)});
	const WebSocket = require('ws');

	const wss = new WebSocket.Server({
		port,
		perMessageDeflate: {
			zlibDeflateOptions: {
				// See zlib defaults.
				chunkSize: 1024,
				memLevel: 7,
				level: 3
			},
			zlibInflateOptions: {
				chunkSize: 10 * 1024
			},
			// Other options settable:
			clientNoContextTakeover: true, // Defaults to negotiated value.
			serverNoContextTakeover: true, // Defaults to negotiated value.
			serverMaxWindowBits: 10, // Defaults to negotiated value.
			// Below options specified as default values.
			concurrencyLimit: 10, // Limits zlib concurrency for perf.
			threshold: 1024 // Size (in bytes) below which messages
			// should not be compressed.
		}
	});

	wss.on('connection', ws => {
		ws.on('message', message => {
			try { message = JSON.parse(message); } catch(e){}
			messageHandler(message, ws);
		});
	});

	// Matching up with express server close

	wss.close = () => {
		wss.clients.forEach((socket) => {

			// Soft close
			socket.close();

			process.nextTick(() => {
				if ([socket.OPEN, socket.CLOSING].includes(socket.readyState)) {
					// Socket still hangs, hard close
					socket.terminate();
				}
			});
		});


	}

	return wss;
};

module.exports = createSocket;
