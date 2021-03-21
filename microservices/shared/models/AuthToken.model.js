const {createModel} = require('../utils/models.util');
const {sha256} = require('../utils/crypto.util')

const FIELDS = {
    id:'string',
    nonce:'string',
    user_index:'string',
    ip:'string',
    expiration:'number',
    encoded:'string'
};

const METHODS = {
    index(){
        return this.rawIndex(this.id);
    },
    userIndex(){
        return this.rawIndex(this.user_index);
    },
    validateIp(ip){
        return sha256(ip) === this.ip;
    }
};

module.exports = createModel('AuthToken', FIELDS, METHODS);
