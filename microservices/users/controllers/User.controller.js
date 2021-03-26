const {results, ORM, authentication, uuid, SALT, couchbase} = require('@finfluencers/shared');
const {sha256} = require('@finfluencers/shared/utils/crypto.util');
const User = require('@finfluencers/shared/models/User.model');
const Interaction = require('@finfluencers/shared/models/Interaction.model');
const {INTERACTION_TYPE} = require('@finfluencers/shared/models/InteractionType');
const UserService = require('@finfluencers/shared/services/User.service');
const BlockchainService = require('@finfluencers/shared/services/Blockchain.service');

module.exports = class UserController {

    static async insert(userJson){
        try {
            if(!userJson.code || !userJson.code.length) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "Invalid activation code");
            if(!userJson.email || !userJson.email.length) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "The email you specified is invalid");
            if(!userJson.name || !userJson.name.replace(/\s+/g, "").length) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "The name you specified is invalid");
            if(!userJson.auth) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "The auth you specified is invalid");

            const activationCode = userJson.code;
            delete userJson.code;

            // TODO: Activate code on blockchain
            const activated = await BlockchainService.checkActivationCode(activationCode);
	        if(!activated) return results.error(results.ERROR_TYPES.BLOCKCHAIN, "Invalid activation code");

            userJson.name = userJson.name.replace(/[\t\n]+/g,' ');
            userJson.email = userJson.email.toLowerCase().replace(/\s+/g, "");

            const auth = new authentication.AccountAuth(userJson.auth);
            if(!auth.isValid()) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "The authorization object is invalid");
            if(auth.type === authentication.AUTH_TYPES.PASSWORD) auth.data = sha256(auth.data + SALT);


            const user = new User(userJson);
            user.auth = auth;

            if(await ORM.exists(user.emailIndex()).catch(() => false))
                return results.error(results.ERROR_TYPES.DATABASE, "This account already exists");

            // Setting unique-id
            user.id = uuid();
            while(!!await UserService.getById(user.id, true).catch((() => false))) user.id = uuid();

            if(!await UserService.insert(user).catch(err => {
            	console.error("Error creating user", err);
            	return null;
            })){
                return results.error(results.ERROR_TYPES.DATABASE, "Could not create the user");
            }

            return results.success(user.safe());
        } catch(e){
            console.error('User controller insert error', e);
            return results.error(results.ERROR_TYPES.DATABASE, "There was an issue creating this user.");
        }
    }

    static async update(email, userJson){
        // TODO: Don't upsert without CAS!
        try {
            email = email.toLowerCase().replace(/\s+/g, "");
            const original = await UserService.get(email);
            if(!original) return results.error(results.ERROR_TYPES.DATABASE, "User does not exist");

            if(userJson.name) original.name = userJson.name.replace(/[\t\n]+/g,' ');
            if(userJson.auth) {
                const auth = new authentication.AccountAuth(userJson.auth);
                if(!auth.isValid()) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "The authorization object is invalid");
                original.auth = userJson.auth;
            }

            if(!await UserService.upsert(original).catch(() => false)){
                return results.error(results.ERROR_TYPES.DATABASE, "Could not update the user");
            }

            return results.success(original.safe());
        } catch(e){
            console.error('User controller update error', e);
            return results.error(results.ERROR_TYPES.DATABASE, "There was an issue updating this user.");
        }
    }

    static async touch(user, quit = false){
	    return ORM.getBucket().mutateIn(user.index(), [
		    couchbase.MutateInSpec.upsert("last_connection", quit ? 0 : +new Date()),
	    ]).catch(err => {
		    console.error("touch set error", err);
		    return false;
	    }).then(x => {
		    return true;
	    });
    }

    static async find(name, user){
	    const users = await ORM.query(`SELECT id FROM BUCKET_NAME WHERE doc_type = 'user' AND name = '${name}'`);
	    if(users.length) {
	        const fetched = (await UserService.getById(users[0].id)).safer();
	        await UserService.prepareUser(fetched, user);
	        return fetched;
	    }
	    return null;
    }

	static async subscribe(id, user){
		// TODO: Add blockchain here

		const parent_index = `user:${id}`;

		if(!await UserService.exists(id))
		    return {error:"The user you are trying to subscribe to does not exist"};

		const interaction = new Interaction({
			// Will fail to insert this if previous interaction already exists
			id:sha256(`${parent_index}:${user.id}:${INTERACTION_TYPE.SUBSCRIBE}`),
			user_id:user.id,
			parent_index,
			parent_owner_id:id,
			type:INTERACTION_TYPE.SUBSCRIBE,
			data:null,
		});

		if(await ORM.exists(interaction.index())){
			await ORM.remove(interaction.index());
			return {};
		}

		const saved = await ORM.insert(interaction).catch(() => null);
		if(!saved) return {error:"Error saving interaction"};

		return interaction;
	}

}
