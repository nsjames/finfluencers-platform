const {results, ORM, authentication, uuid, SALT, couchbase} = require('@finfluencers/shared');
const {sha256} = require('@finfluencers/shared/utils/crypto.util');
const User = require('@finfluencers/shared/models/User.model');
const UserData = require('@finfluencers/shared/models/UserData.model');
const Interaction = require('@finfluencers/shared/models/Interaction.model');
const {INTERACTION_TYPE} = require('@finfluencers/shared/models/InteractionType');
const InteractionService = require('@finfluencers/shared/services/Interaction.service');
const UserService = require('@finfluencers/shared/services/User.service');
const BlockchainService = require('@finfluencers/shared/services/Blockchain.service');

// RFC 2822 standard email validation
// https://www.w3resource.com/javascript/form/email-validation.php
const validateEmail = (email) => /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email);

module.exports = class UserController {

	static async isNameAvailable(name){
		const found = await UserService.getByName(name);
		return !found;
	}

    static async insert(userJson){
        try {
            if(!userJson.code || !userJson.code.length) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "Invalid activation code");
            if(!userJson.email || !validateEmail(userJson.email)) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "The email you specified is invalid");
            if(!userJson.name || !userJson.name.replace(/\s+/g, "").length) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "The name you specified is invalid");
            if(!userJson.auth) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "The auth you specified is invalid");
            if(!userJson.keys || typeof userJson !== 'object') return results.error(results.ERROR_TYPES.INVALID_PARAMS, "The encrypted keys were invalid");
            if(!userJson.keys.hasOwnProperty('public') && userJson.public.length) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "The encrypted keys were invalid");
            if(!userJson.keys.hasOwnProperty('encrypted') && userJson.encrypted.length) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "The encrypted keys were invalid");

            const {defaultAccountType, monthlyIncome, monthlyExpenses, strengths, goals} = userJson;

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

            const user = new User({
	            id:'',
	            name:userJson.name,
	            email:userJson.email,
	            auth,
	            graphics:{},
	            keys:userJson.keys,
	            chain_id:BlockchainService.getChainId()
            });

            if(await ORM.exists(user.emailIndex()).catch(() => false))
                return results.error(results.ERROR_TYPES.DATABASE, "This email already has an account");

            if(await UserService.getByName(user.name))
                return results.error(results.ERROR_TYPES.DATABASE, "This username is already taken");

            // Setting unique-id
            user.id = uuid();
            while(!!await UserService.getById(user.id, true).catch((() => false))) user.id = uuid();

	        // Will throw here if invalid fields
	        const userData = new UserData(Object.assign({
		        user_id:user.id
	        }, userJson.data));

	        // TODO: Register on blockchain
	        const pushedToChain = await BlockchainService.user(user);
	        if(!pushedToChain) return results.error(results.ERROR_TYPES.DATABASE, "Could not create user on chain");

            if(!await UserService.insert(user).catch(err => {
            	console.error("Error creating user", err);
            	return null;
            })){
                return results.error(results.ERROR_TYPES.DATABASE, "Could not create the user");
            }

            await ORM.insert(userData);

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



            if(userJson.name) {
	            if(await ORM.exists((new User({name:userJson.name})).nameIndex()).catch(() => false))
		            return results.error(results.ERROR_TYPES.DATABASE, "This username is already taken");

            	original.name = userJson.name.replace(/[\t\n]+/g,' ');
            }

            // TODO: Update key encryption!
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

    static async getSelfUser(user){
	    await UserService.buildSnapshot(user);
	    const userData = await ORM.get((new UserData({user_id:user.id})).index());
	    user = user.safe();
	    user.data = userData;
	    return user;
    }

    static async getEncryptedKey(user){
	    const rawUser = await UserService.getById(user.id, false, false);
	    return rawUser ? rawUser.keys : rawUser;
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
		if(!await UserService.exists(id))
		    return {error:"The user you are trying to subscribe to does not exist"};

		const shaID = sha256(`user:${id}:${user.id}:${INTERACTION_TYPE.SUBSCRIBE}`);
		const index = (new Interaction({id:shaID})).index();

		if(await ORM.exists(index)){
			if(!await InteractionService.removeInteraction(shaID, id, user))
				return {error:"Could not remove subscription from chain"};
			return {};
		}

		const saved = await InteractionService.addInteraction(
			shaID,
			user,
			`user:${id}`,
			id,
			INTERACTION_TYPE.SUBSCRIBE
		);

		return saved ? saved : {error:"Error saving interaction"};
	}

}
