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

	const directories = getDirectories()
}

run();

(async () => {

})();


