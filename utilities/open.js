const execute = require('./execute');

const platformSpecificCommand = (url) => {
    const { platform } = process;
    switch (platform) {
        case 'android':
        case 'linux':
            return `xdg-open \"${url}\"`;
        case 'darwin':
            return `open ${url}`;
        case 'win32':
            return `cmd /c start ${url}`;
        default:
            throw new Error(`Platform ${platform} isn't supported.`);
    }
};

module.exports = url => {
    try {
        return execute(platformSpecificCommand(url))
    } catch(e){
        console.error('open error', e);
        return null;
    }
};
