const assert = (truthy, msg) => {
    if(!truthy) {
        console.error('----------------------------');
        console.error(msg);
        console.error('----------------------------');
        process.exit(1);
    }
}

module.exports = {assert};
