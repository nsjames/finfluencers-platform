import {CONTENT_TYPE} from "./ContentType";

const {createModel} = require('../utils/models.util');
const {sha256} = require('../utils/crypto.util');


const FIELDS = {
    id:'number',
    user_id:'number',
    type:'number',
    data:'any',
    text:'any',
    tags:'any',
    wealth:'number',
};

const METHODS = {
    index(){
        return this.rawIndex(this.user_id, this.id);
    },
    constructor(json){
        if(!json.hasOwnProperty('id') || json.id === null){
            json.wealth = 0;
            json.tags = [];
            json.text = '';
            json.data = null;
            json.type = CONTENT_TYPE.TEXT;
            json.user_id = 0;
            json.id = 0;
        }
    },
};

module.exports = createModel('Content', FIELDS, METHODS);
