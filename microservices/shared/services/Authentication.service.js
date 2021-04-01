const ORM = require('../orm');
const AuthToken = require('../models/AuthToken.model');
const uuid = require('../utils/uuid.util');
const {sha256, SALT} = require('../utils/crypto.util');
const UserService = require('./User.service');
const Results = require('../models/Results.model');

const encode = auth => {
    return `${auth.id}:${sha256(`${auth.nonce}:${auth.user_index}:${auth.ip}:${auth.expiration}`)}`;
};

module.exports = class AuthenticationService {

    static async createToken(email, pass, ip){
        try {
            let user = null;
            user = await UserService.get(email);
            if(!user) return Results.error(Results.ERROR_TYPES.DATABASE, "User does not exist");

            if(sha256(pass + SALT) !== user.auth.data) return Results.error(Results.ERROR_TYPES.INVALID_PARAMS, "Password is incorrect.");

            const authToken = new AuthToken({
                id:sha256(`${uuid()}${uuid()}${uuid()}`),
                nonce:uuid(),
                user_index:user.index(),
                ip:sha256(ip),
                expiration:+new Date() + (1000*60*60*24*365)
            });

            authToken.encoded = encode(authToken);

            try {
                await this.removeToken(user.index(), ip);
                await Promise.all([
                    ORM.insert(authToken),
                    ORM.upsert(authToken.index(), authToken.userIndex())
                ]);
            } catch(e){
                console.error('Error creating auth token', e);
                return Results.error(Results.ERROR_TYPES.DATABASE, "Error inserting authentication token");
            }

            return Results.success(authToken.encoded);
        } catch(e){
            console.error(`Create token error`, e);
            return Results.error(Results.ERROR_TYPES.DATABASE, "Failure to create token");
        }
    }

    static async getToken(user_index){
        const index = await ORM.get((new AuthToken({user_index})).userIndex()).catch(() => null);
        if(!index) return null;
        return ORM.get(index, AuthToken).catch(err => {
	        return null;
        });
    }

    static async removeToken(user_index, ip){

        const token = await this.getToken(user_index).catch(() => null);
        if(!token) return;

        if(!token.validateIp(ip)) return false;

        return ORM.remove(token.index()).then(x => true).catch(err => {
            console.error(`Error removing auth`, err);
            return false;
        });
    }

    static async validate(req, res, next){
        try {
            const fail = () => res.status(401).send(null);

            const rawToken = req.headers['x-auth-token'];

            if(!rawToken) return fail();

            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            const [id, encoded] = rawToken.split(':');
            if(!id || !id.length) return fail();
            if(!encoded || !encoded.length) return fail();

            const auth = await ORM.get((new AuthToken({id})).index(), AuthToken).catch(() => null);
            if(!auth) return fail();

            if(auth.expiration <= +new Date()) return fail();

            const hash = sha256(`${auth.nonce}:${auth.user_index}:${sha256(ip)}:${auth.expiration}`);
            if(`${id}:${hash}` !== auth.encoded) return fail();

            req.user = await UserService.getById(auth.user_index.split(':')[1], true, false);
            next();
        } catch(e){
            console.error(`Validate authentication error`, e);
            return fail();
        }
    }

}
