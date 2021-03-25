const {createModel} = require('../utils/models.util');
const {sha256} = require('../utils/crypto.util');


const FIELDS = {
    id:'string',
    user_id:'string',
    parent_index:'string',
    parent_owner_id:'string',
    type:'number',
    data:'any',
};

const METHODS = {
    index(){
        return this.rawIndex(this.id);
    },
    constructor(json){
        if(!json.hasOwnProperty('type') || !json.type) json.type = 0;
    },
};

module.exports = createModel('Interaction', FIELDS, METHODS);
