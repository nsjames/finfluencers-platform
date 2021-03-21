const env = require('../runner/runner_env');
const execute = require('../utilities/execute');
const fs = require('fs');
const glob = require("glob");
require('isomorphic-fetch');
const logger = require('../utilities/logger');
const couchbase = require('../microservices/shared/couchbase');
const ORM = require('../microservices/shared/orm');

// logger.setLevel(4);

var Mocha = require('mocha'),
    path = require('path');

const [
    E2E = false,
    SERVICES = null,
] = process.argv.slice(2);

const run = async () => {

    try {
        // await execute(`pkill -f 'microservices/'`);
        // process.env.UNIT_TESTING = true;

        Object.keys(env).map(key => {
            process.env[key] = env[key];
        });
        process.env.BUCKET_NAME = 'finfluencers_test';

        ORM.init();
        await couchbase.flush();
        // There's a delay between flushing and indexer rollbacks,
        // but no way to get the state programatically :(
        await new Promise(r => setTimeout(r, 5000));

        require('../runner/run');

        const runTests = (files) => {
            if (files.length) {
                return new Promise(r => {
	                const mocha = new Mocha({
		                timeout:60000,
		                allowUncaught:true,
		                bail:true,
		                diff:true,
		                fullTrace:true,

	                });
	                for (let n = 0; n < files.length; n++) {
		                const filepath = files[n];
		                mocha.addFile(path.join(files[n]));
	                }
	                mocha.run(failures => {
	                    r(!failures);
	                });
                })
            }
        }

        if(E2E == true || E2E === "true"){
            await new Promise(async r => {
                execute(`node runner/run.js`)
                await new Promise(r => setTimeout(r, 1000));
                glob(`./microservices/tests/**/*.e2e.js`, {}, async (er, files) => {
                    await runTests(files);
                    r(true);
                })
            })
        } else {
            const microservices = SERVICES ? [SERVICES.split(',')] : fs.readdirSync('./microservices').filter(x => x.indexOf('.') === -1 && x !== 'scaffold');

            for (let i = 0; i < microservices.length; i++) {
                const service = microservices[i];

                await new Promise(r => {
                    glob(`./microservices/${service}/**/*.spec.js`, {}, async (er, files) => {
                        runTests(files);
                        r(true);
                    })
                })

            }
        }
    } catch(e){
        console.error('Uncaught error', e);
    }


	process.exit(0);

}

run();
