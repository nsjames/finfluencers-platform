const env = require('./runner_env');
const execute = require('../utilities/execute');
const fs = require('fs');
const chokidar = require('chokidar');
const decache = require('decache');
require('isomorphic-fetch')
const createServer = require('../microservices/shared/server');



const { Router } = require('../microservices/shared');

const requireUncached = module => {
    decache(module);
    return require(module);
}

const [
    TESTING = false,
] = process.argv.slice(2);

const MODE = '';

let servers = [];

(async () => {
    Object.keys(env).map(key => {
        // Some env variables are stringified JSON
        try { env[key] = JSON.parse(env[key]) } catch(e){}
        if(key === 'BUCKET_NAME' && !!process.env.BUCKET_NAME) return;
        process.env[key] = env[key];
    })

    const microservices = fs.readdirSync('./microservices')
        .filter(x => x.indexOf('.') === -1)
        .filter(x => x !== 'scaffold')
        .filter(x => x !== 'shared')
        .filter(x => x !== 'tests')

    const BALANCER_PORT = 40406;

    const setup = async (reloading = false) => {
        if(reloading) {
	        console.log('Reloading on changes:', reloading);
        	await Promise.all(servers.map(async server => {
		        if(typeof server.server.clearIntervals === "function") await server.server.clearIntervals();
		        if(typeof server.server.close === 'function') await server.server.close();
		        else await server.server[1].close();
	        }));
        }

        if(!TESTING) require('../microservices/shared/orm').init();

        servers = await Promise.all(microservices.map(async service => {
            const server = await requireUncached(`../microservices/${service}/index`);
            if(!server) return;
            return {
                name: service,
                port:server.options ? server.options.port : server[1]._connectionKey.split(':').filter(x => !!x.length)[1],
                server,
            }
        }));


	    const loadBalancerRouting = () => {
		    const routes = Router();

		    servers.map(({name, port}) => {
			    routes.get(`/${name}*`, async (req, res) => {
				    const path = req.url.replace('/'+name, '');
				    await fetch(`http://localhost:${port}${path}`, {headers:req.headers}).then(async x => {
					    if(x.status !== 200) return res.sendStatus(x.status);
					    const text = await x.text();
					    try {
					    	const json = JSON.parse(text);
					    	res.json(json);
					    } catch(e){
						    res.set('Content-Type', 'text/html');
						    res.send(Buffer.from(text));
					    }
				    });
			    });
			    routes.post(`/${name}*`, async (req, res) => {
			    	const path = req.url.replace('/'+name, '');
				    await fetch(`http://localhost:${port}${path}`, {
					    method: 'POST',
					    headers: req.headers,
					    body: JSON.stringify(req.body)
				    }).then(async x => {
					    if(x.status !== 200) return res.sendStatus(x.status);
					    const text = await x.text();
					    try {
						    const json = JSON.parse(text);
						    res.json(json);
					    } catch(e){
						    res.set('Content-Type', 'text/html');
						    res.send(Buffer.from(text));
					    }
				    });
			    });
		    });

		    routes.get('/ping', (req, res) => res.json(true));

		    return routes;
	    };
	    let loadBalancer;
	    while(!loadBalancer){
		    loadBalancer = await createServer(BALANCER_PORT, loadBalancerRouting, false).catch(() => false)
	    	await new Promise(r => setTimeout(r, 100));
	    }
	    if(loadBalancer) {
		    servers.push({
			    name: 'loadbalancer',
			    port: loadBalancer[1]._connectionKey.split(':').filter(x => !!x.length)[1],
			    server: loadBalancer,
		    });
	    }

	    if(!reloading) servers.map(x => {
		    console.log(x.name, x.port);
	    })
    }
    await setup();

    console.log('------------------------------------------');
    console.log(`Running load balancer on http://localhost:${BALANCER_PORT}`)
    console.log('------------------------------------------');


    const watcher = chokidar.watch(['./microservices'], {
        ignored: (path) => path.includes('node_modules'),
        persistent: true
    });

    let setupTime = +new Date();
    let reloadTimer;
    const delayedSetup = (changed_file) => {
	    clearTimeout(reloadTimer);
	    reloadTimer = setTimeout(() => {
		    setup(changed_file.replace(/___jb_tmp___/g, ''))
	    }, 500);
    };
    watcher
        .on('add', () => (+new Date() - 5000) < setupTime ? null : delayedSetup)
        .on('change', delayedSetup)
        .on('unlink', delayedSetup)
        .on('error', delayedSetup)
})();



