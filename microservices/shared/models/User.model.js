const {createModel} = require('../utils/models.util');
const {sha256} = require('../utils/crypto.util');
const AccountAuth = require('./AccountAuth.model');

const FIELDS = {
    id:'string',
    name:'string',
    email:'string',
    auth:'object',
    wealth:'number',
    public_key:'string',
    graphics:'any',
};

const METHODS = {
    index(){
        return this.rawIndex(this.id);
    },
    emailIndex(){
        return this.rawIndex('email', sha256(this.email))
    },
    constructor(json){
        if(!json.hasOwnProperty('id')) {
            json.id = uuid();
            json.name = '';
            json.email = '';
            json.auth = null;
        }
        if(!json.hasOwnProperty('wealth') || json.wealth === null) {
            json.wealth = 0;
        }
        if(!json.hasOwnProperty('public_key') || !json.public_key) {
            json.public_key = '';
        }
    },
    safe(){
        const auth = this.auth instanceof AccountAuth ? this.auth : new AccountAuth(this.auth);
        return {
            id:this.id,
            name:this.name,
            email:this.email,
            auth:auth.safe(),
	        wealth:this.wealth,
        }
    },
    safer(){
        const safer = this.safe();
        delete safer.auth;
        return safer;
    },
};

module.exports = createModel('User', FIELDS, METHODS);
