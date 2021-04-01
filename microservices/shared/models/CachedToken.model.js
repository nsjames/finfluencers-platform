const {createModel} = require('../utils/models.util');
const {sha256} = require('../utils/crypto.util')

const FIELDS = {
    id:'string',
    name:'string',
    symbol:'string',
    platform:'string',
    contract:'any',
};

const METHODS = {
    index(){
        return this.rawIndex(this.id);
    },
};

module.exports = createModel('CachedToken', FIELDS, METHODS);
