const {createModel} = require('../utils/models.util');
const {sha256} = require('../utils/crypto.util');
const AccountAuth = require('./AccountAuth.model');

const FIELDS = {
    id:'string',
    name:'string',
    email:'string',
    auth:'object',
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
    nameIndex(){
        return this.rawIndex('name', sha256(this.name))
    },
    constructor(json){
        if(!json.hasOwnProperty('id')) {
            json.id = uuid();
            json.name = '';
            json.email = '';
            json.auth = null;
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
	        snapshot:this.snapshot || {},
        }
    },
    safer(){
        const safer = this.safe();
        delete safer.auth;
        delete safer.email;
        return safer;
    },
};

module.exports = createModel('User', FIELDS, METHODS, ['snapshot', 'interactions', 'data']);
