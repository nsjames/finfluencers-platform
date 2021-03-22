const ERROR_TYPES = {
    INVALID_PARAMS:     100000,
    DATABASE:           200000,
    GENERIC:            300000,
    BLOCKCHAIN:         400000,
};

const error = (code, details) => {
    if(!code) code = ERROR_TYPES.GENERIC;
    return {
        code, details, error:true
    }
}

const success = (data) => {
    return {data};
}

module.exports = {
    ERROR_TYPES,
    error,
    success
}
