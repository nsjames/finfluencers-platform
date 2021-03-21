require('dotenv');
const ORM = require('./orm');

const {validateFields, createModel} = require('./utils/models.util');

Math.finfluencers = {};
Math.finfluencers.median = arr => {
	const mid = Math.floor(arr.length / 2);
	const nums = [...arr].sort((a, b) => a - b);
	return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

Math.finfluencers.average = arr => arr.reduce((acc,x) => acc+x,0) / arr.length;;

module.exports = {
    couchbase:require('couchbase'),
    createServer:require('./server'),
    createSocket:require('./socket'),
    Router:require('express').Router,
    results:require('./models/Results.model'),
    uuid:require('./utils/uuid.util'),
    validateFields,
    ORM,
    createModel,
    authentication:{
        AUTH_TYPES:{
            OAUTH:0,
            PASSWORD:1
        },
        AccountAuth:require('./models/AccountAuth.model')
    },
    SALT:require('./utils/crypto.util').SALT
};
