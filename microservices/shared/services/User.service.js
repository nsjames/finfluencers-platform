const UserSnapshot = require("../models/UserSnapshot");
const {INTERACTION_TYPE} = require('../models/InteractionType');

const ORM = require('../orm');
const User = require('../models/User.model');
const UserInfluence = require('../models/UserInfluence.model');
const Interaction = require('../models/Interaction.model');
const couchbase = require('couchbase');

const INTERACTIONS_QUERY = (fetchedUser, fetchingUser) =>
	`SELECT * FROM BUCKET_NAME WHERE doc_type = 'interaction' AND parent_index = 'user:${fetchedUser.id}' AND user_id = '${fetchingUser.id}'`;

module.exports = class UserService {

	static async prepareUser(fetchedUser, fetchingUser){
		fetchedUser.interactions = await ORM.query(INTERACTIONS_QUERY(fetchedUser, fetchingUser), Interaction);
	}

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

    static async getById(id, swallowError = false, prepare = true){
        try {
            let user = new User({id});
	        user = await ORM.get(user.index(), User).catch(err => {
	            if(!swallowError) console.error("User get by id error: ", err);
	            return null;
            });

	        if(user && prepare) await this.buildSnapshot(user);

	        return user;
        } catch(e){
            console.error('User service get by id error', e);
            return null;
        }
    }

    static async getByName(name, prepare = false){
		return ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'user' AND LOWER(name) = '${name.toLowerCase()}'`, User).then(async x => {
			if(Array.isArray(x)) x = x[0];
			if(!prepare) return x;
			await this.buildSnapshot(x);
			return x;
		});
    }

    static async exists(id){
        return ORM.exists((new User({id})).index());
    }

    static async getUserInfluence(user){
		return ORM.get((new UserInfluence({user_id:user.id})).index()).then(x => x.influence).catch(() => 0);
	    // const interactionCount = await ORM.query(`SELECT COUNT(*) FROM BUCKET_NAME WHERE doc_type = 'interaction' AND parent_owner_id = '${user.id}'`);
	    // const negativeContentResolutions = await ORM.query(`SELECT COUNT(*) FROM BUCKET_NAME WHERE doc_type = 'interaction' AND parent_owner_id = '${user.id}' AND type = ${INTERACTION_TYPE.CONTENT_RESOLUTION} AND data = -1`);
	    // return userInfluence + interactionCount - (negativeContentResolutions * 2);
    }

    static async buildSnapshot(user){
        user.snapshot = new UserSnapshot();
        // TODO: Potential and portfolio value
        user.snapshot.influence = await this.getUserInfluence(user);
	    user.snapshot.subscribers = await ORM.query(`SELECT COUNT(*) FROM BUCKET_NAME WHERE doc_type = 'interaction' AND parent_owner_id = '${user.id}' AND type = ${INTERACTION_TYPE.SUBSCRIBE}`)
    }

    static async totalUsers(){
        return ORM.query(`SELECT COUNT(*) FROM BUCKET_NAME WHERE doc_type = 'user'`);
    }

    static async deltaInfluence(delta, user_id){
		const influence = new UserInfluence({user_id, influence:0});
		if(!await ORM.exists(influence.index())){
			await ORM.insert(influence);
		}

	    return ORM.getBucket().mutateIn(influence.index(), [
		    couchbase.MutateInSpec.increment("influence", delta),
	    ]).catch(err => {
		    console.error("Did not add experience", err);
		    return false;
	    }).then(() => true);
    }

}
