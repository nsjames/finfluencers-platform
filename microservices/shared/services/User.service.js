const UserSnapshot = require("../models/UserSnapshot");

const ORM = require('../orm');
const User = require('../models/User.model');
const couchbase = require('couchbase');

module.exports = class UserService {

    static async insert(user){
        if(!user instanceof User) throw "user param must be an instance of User";
        return await ORM.insert(user).then(async x => {
            return [
                x,
                await ORM.insert(user.index(), user.emailIndex()),
            ];
        });
    }

    static async upsert(user){
        if(!user instanceof User) throw "user param must be an instance of User";
        return await ORM.upsert(user);
    }

    static async get(email){
        try {
            const user = new User({email});
            const index = await ORM.get(user.emailIndex()).catch(() => null);
            if(!index) return null;
            return ORM.get(index, User).catch(err => {
	            console.error("Get by email error: ", err);
	            return null;
            });
        } catch(e){
            console.error('User service get error', e);
            return null;
        }
    }

    static async getById(id, swallowError = false){
        try {
            let user = new User({id});
	        user = await ORM.get(user.index(), User).catch(err => {
	            if(!swallowError) console.error("User get by id error: ", err);
	            return null;
            });

	        if(user) await this.buildSnapshot(user);

	        return user;
        } catch(e){
            console.error('User service get by id error', e);
            return null;
        }
    }

    static async buildSnapshot(user){
        user.snapshot = new UserSnapshot();
        user.snapshot.influence = await ORM.query(`SELECT COUNT(*) FROM BUCKET_NAME WHERE doc_type = 'interaction' AND parent_owner_id = '${user.id}'`);
    }

    static async totalUsers(){
        return ORM.query(`SELECT COUNT(*) FROM BUCKET_NAME WHERE doc_type = 'user'`);
    }

}
