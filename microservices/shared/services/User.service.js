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
            return ORM.get(index, User);
        } catch(e){
            console.error('User service get error', e);
            return null;
        }
    }

    static async getById(id){
        try {
            const user = new User({id});
            return ORM.get(user.index(), User);
        } catch(e){
            console.error('User service get by id error', e);
            return null;
        }
    }

    static async getByIndex(index){
        try {
            return ORM.get(index, User);
        } catch(e){
            console.error('User service get by id error', e);
            return null;
        }
    }

    static async totalUsers(){
        return ORM.query(`SELECT COUNT(*) FROM BUCKET_NAME WHERE docType = 'user'`);
    }

	static async addWealth(user_index){
		const user = await this.getByIndex(user_index);
		if(!user){
			console.error("Could not get user to add wealth", user_index);
			return;
		}

		await ORM.getBucket().mutateIn(user.index(), [
			couchbase.MutateInSpec.increment("wealth", 1),
		]).catch(err => {
			console.error("Did not add wealth", err);
			return false;
		})
	}

}
