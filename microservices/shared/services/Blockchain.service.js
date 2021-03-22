const ORM = require('../orm');
const AuthToken = require('../models/AuthToken.model');
const uuid = require('../utils/uuid.util');
const {sha256, SALT} = require('../utils/crypto.util');
const UserService = require('./User.service');
const Results = require('../models/Results.model');

const encode = auth => {
    return `${auth.id}:${sha256(`${auth.nonce}:${auth.user_index}:${auth.ip}:${auth.expiration}`)}`;
};

module.exports = class BlockchainService {

    static async checkActivationCode(code){
        return true;
    }

    static async claimActivationCode(code, user_id){
        return true;
    }

    static async postContent(user_id, content){

    }

}
