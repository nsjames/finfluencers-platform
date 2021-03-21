const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const getPort = require('get-port');
const cookieParser = require('cookie-parser');

/***
 * Creates an HTTP server
 * @param port
 * @param routeGenerator - Allows changing the route configuration
 * @param emitRoutes
 * @param addedMethods
 */
const createServer = async (port, routeGenerator, emitRoutes = false, addedMethods = {}) => {
    if(!port) port = await getPort({port: getPort.makeRange(50505, 51515)});
    return new Promise(resolve => {
        const server = express();
        server.disable('x-powered-by');
        server.use(compression());
        server.use(cors());
        server.use(cookieParser());
        server.use(bodyParser.urlencoded({ extended: true }));
        server.use(bodyParser.json());

        const routes = routeGenerator();
        routes.all('*', (req, res) => res.sendStatus(403));

        if(emitRoutes) {
            console.log('');
            console.group(`${port} -- API routes: `);
            routes.stack.map(({route}) => {
                const method = route.stack[0].method;
                if (!method) return;
                return `${route.stack[0].method.toUpperCase()} ${route.path}`;
            })
                .filter(x => !!x)
                .sort((a, b) => a.localeCompare(b))
                .map(x => console.log(x));

            console.log('');
            console.groupEnd();
        }


        server.use(routes);

        // Catch 404 and forward to error handler
        server.use((req, res, next) => {
            const err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // Generic error handler
        server.use((err, req, res, next) => {
            res.status(err.status || 500).render('error', { message: err.message });
        });

        try {
	        const listening = server.listen(port, () => {
	            Object.keys(addedMethods).map(method => server[method] = addedMethods[method])
	            resolve([server, listening])
	        });
        } catch(e){
            resolve(false);
        }
    })
};

module.exports = createServer;
