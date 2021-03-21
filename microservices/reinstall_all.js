const execute = require('../utilities/execute');
const fs = require('fs');

(async () => {
	const microservices = fs.readdirSync('./')
		.filter(x => x !== 'scaffold')
		.filter(x => x.indexOf('.') === -1)

	microservices.map(service => {
		console.log('Installing', service);
		if(service === 'shared'){
			execute(`cd ./${service} && rm -rf node_modules && npm i && npm link`)
		} else {
			execute(`cd ./${service} && rm -rf node_modules && npm i && npm link @finfluencers/shared`)
		}
	})
})();


