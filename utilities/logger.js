let level = 0;

module.exports = {
    // 1: Error
    // 2: Warn
    // 3: Debug
    // 4: Log
    setLevel(_level){
        level = _level;
    },
    log:(...params) => {
        if(level > 3) return;
        console.log(`LOG: `, ...params);
    },
    debug:(...params) => {
        if(level > 2) return;
        console.warn(`DEBUG: `, ...params);

    },
    warn:(...params) => {
        if(level > 1) return;
        console.warn(`WARN: `, ...params);
    },
    error:(...params) => {
        if(level > 0) return;
        console.error(`ERROR: `, ...params);
    },
}
