const {results, ORM, authentication, uuid, SALT, couchbase} = require('@finfluencers/shared');
const {sha256} = require('@finfluencers/shared/utils/crypto.util');
const User = require('@finfluencers/shared/models/User.model');
const UserService = require('@finfluencers/shared/services/User.service');

module.exports = class UserController {

    static async insert(userJson){
        try {
            if(!userJson.email || !userJson.email.length) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "The email you specified is invalid");
            if(!userJson.name || !userJson.name.replace(/\s+/g, "").length) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "The name you specified is invalid");
            if(!userJson.auth) return results.error(results.ERROR_TYPES.INVALID_PARAMS, "The auth you specified is invalid");

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
            while(!!await UserService.getById(user.id).catch((() => false))) user.id = uuid();

            if(!await UserService.insert(user).catch(() => false)){
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

}
