const { assert } = require('../../../utilities/assert');

const Controller = require('../controllers/User.controller');
const UserService = require('@finfluencers/shared/services/User.service');
const ORM = require('@finfluencers/shared/orm');

const insert = (...params) => {
    return Controller.insert(...params).then(x => {
        return !x.error;

    })
}

const update = (...params) => {
    return Controller.update(...params).then(x => {
        return !x.error;
    })
}

describe('User controller', () => {


    it('should NOT be able to register a new user with invalid params', done => {
        new Promise(async() => {
            assert(!await insert({ name:'', email:'test@test.com', auth:{ type:1, data:'1111' } }), "Inserted (name)");
            assert(!await insert({ name:'test', email:'', auth:{ type:1, data:'1111' } }), "Inserted (email)");
            assert(!await insert({ name:'test', email:'test@test.com', auth:{ type:1, data:null } }), "Inserted (auth.data)");
            assert(!await insert({ name:'test', email:'test@test.com', auth:{ type:2, data:null } }), "Inserted (auth.type)");

            done();
        });
    });

    it('should be able to register a new user', done => {
        new Promise(async() => {
            assert(await insert({ name:'test', email:'test@test.com', auth:{ type:1, data:'1111' } }), "Did not insert a user");
            assert(await UserService.get('test@test.com'), "Did not find inserted user");

            done();
        });
    });

    it('should NOT be able to register an existing user', done => {
        new Promise(async() => {
            assert(!await insert({ name:'test', email:'test@test.com', auth:{ type:1, data:'1111' } })
                .catch(() => true), "Double registration");

            done();
        });
    });

    it('should be able to update a user', done => {
        new Promise(async() => {
            assert(await update('test@test.com', { name:'test2', email:'test2@test.com' }), "Did not update a user");
            const user = await UserService.get('test@test.com');
            assert(user.name === 'test2', "Did not update name");
            assert(user.email === 'test@test.com', "Updated email");

            // ORM.dump();
            done();
        });
    });


});
