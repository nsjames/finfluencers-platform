const {CONTENT_TYPE} = require("./ContentType");

const {createModel} = require('../utils/models.util');
const {sha256} = require('../utils/crypto.util');
const {getOrDefault} = require('../utils/getOrDefaultProp');


const FIELDS = {
    id:'string',
    user_id:'string',
    type:'number',
    data:'any',
    text:'object',
    tags:'any',
    soft_delete:'number',
    signature:'string',
	chain_id:'string',
};

const METHODS = {
    index(){
        return this.rawIndex(this.id);
    },
    constructor(json){
        if(!json.hasOwnProperty('tags') || !json.tags) json.tags = [];
        if(!json.hasOwnProperty('soft_delete') || !json.soft_delete) json.soft_delete = 0;
        if(!json.hasOwnProperty('signature') || !json.signature) json.signature = '';
        if(!json.hasOwnProperty('chain_id') || !json.signature) json.chain_id = '';
    },
};

module.exports = createModel('Content', FIELDS, METHODS, ['user', 'interactions', 'trackers']);
