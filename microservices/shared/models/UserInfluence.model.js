const {createModel} = require('../utils/models.util');

const FIELDS = {
    user_id:'string',
    influence:'number',
};

const METHODS = {
    index(){
        return this.rawIndex(this.id);
    },
    constructor(json){

    },
};

module.exports = createModel('UserInfluence', FIELDS, METHODS);
