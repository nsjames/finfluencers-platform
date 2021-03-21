const exec = require('child_process').exec;

module.exports = (command, options) => {
    return new Promise(async resolve => {
        let promise = new Promise((resolve, reject) => {
            exec(command, options, (error, stdout, stderr) => {
                if (error !== null) return reject({cmd: command, err:stderr});
                if(stdout && stdout.length) console.log(stdout);
                if(stderr && stderr.length) console.log(stderr);
                return resolve(stdout);
            });
        });


        promise
            .then(() => resolve(true))
            .catch(({cmd, err}) => {
                console.log('execute err', err);
                resolve(false);
            });
    });
}
