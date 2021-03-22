const {CONTENT_TYPE} = require("./ContentType");

const {createModel} = require('../utils/models.util');
const {sha256} = require('../utils/crypto.util');


const FIELDS = {
    id:'string',
    user_id:'string',
    type:'number',
    data:'any',
    text:'object',
    tags:'any',
    wealth:'number',
};

const METHODS = {
    index(){
        return this.rawIndex(this.id);
    },
    constructor(json){
        if(!json.hasOwnProperty('wealth') || !json.wealth) json.wealth = 0;
        if(!json.hasOwnProperty('tags') || !json.tags) json.tags = [];
    },
};

module.exports = createModel('Content', FIELDS, METHODS, ['user']);
