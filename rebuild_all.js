const execute = require('./utilities/execute');
const fs = require('fs')
const path = require('path')

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
	readdirSync(source).map(name => join(source, name)).filter(isDirectory);

const hasPackageJson = source => {
	return readdirSync(source).some(x => x === 'package.json');
};

const getPackageJsonDirs = (dir, filelist = []) => {
	fs.readdirSync(dir).map(file => {
		if(file === 'node_modules') return;
		if(file === 'scaffold') return;
		if (fs.lstatSync(`${dir}/${file}`).isDirectory()) filelist = getPackageJsonDirs(`${dir}/${file}`, filelist);
		else {
			if (file === 'package.json') {
				filelist.push(dir);
			}
		}
	});

	return filelist;
};

const run = async () => {

	const directories = getPackageJsonDirs('.').sort((a,b) => {
		return a.indexOf('shared') !== -1 ? -1 : 1;
	});

	const shared = directories.shift();

	// This must come first since it's a local npm link
	await execute(`cd ${shared} && rm -rf node_modules && rm package-lock.json && npm i && npm link && npm rebuild`);

	// These can be concurrent
	directories.map(dir => {
		if (dir.indexOf('microservice') > -1){
			execute(`cd ${dir} && rm -rf node_modules && rm package-lock.json && npm i && npm link @finfluencers/shared && npm rebuild`)
		}

		else {
			execute(`cd ${dir} && rm -rf node_modules && rm package-lock.json && npm i && npm rebuild`)
		}
	})



	// const microservices = fs.readdirSync('./')
	// 	.filter(x => x !== 'scaffold')
	// 	.filter(x => x.indexOf('.') === -1)
	//
	// microservices.map(service => {
	// 	console.log('Installing', service);
	// 	if(service === 'shared'){
	// 		execute(`cd ./${service} && rm -rf node_modules && npm i && npm link`)
	// 	} else {
	// 		execute(`cd ./${service} && rm -rf node_modules && npm i && npm link @finfluencers/shared`)
	// 	}
	// })
}

run();

(async () => {

})();


