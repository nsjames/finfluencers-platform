const {createModel} = require('../utils/models.util');
const {sha256} = require('../utils/crypto.util');
const AccountAuth = require('./AccountAuth.model');

const FIELDS = {
    id:'string',
    name:'string',
    email:'string',
    auth:'object',
    last_connection:'number',
    wealth:'number',
};

const METHODS = {
    index(){
        return this.rawIndex(this.id);
    },
    emailIndex(){
        return this.rawIndex('email', sha256(this.email))
    },
    constructor(json){
        if(!json.hasOwnProperty('last_connection') || typeof json.last_connection !== "number") {
            json.last_connection = 0;
        }
        if(!json.hasOwnProperty('wealth') || json.wealth === null){
            json.wealth = 0;
        }
    },
    safe(){
        const auth = this.auth instanceof AccountAuth ? this.auth : new AccountAuth(this.auth);
        return {
            id:this.id,
            name:this.name,
            email:this.email,
            auth:auth.safe(),
            last_connection:this.last_connection,
	        wealth:this.wealth,
        }
    },
};

module.exports = createModel('User', FIELDS, METHODS);
