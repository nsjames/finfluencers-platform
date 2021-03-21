const { assert } = require('../../../utilities/assert');
const {ORM, createServer, Router} = require('../../shared/index');
const User = require('../../shared/models/User.model');
const UserService = require('../../shared/services/User.service');
const MessageQueueService = require('../../shared/services/MessageQueue.service');
const open = require('open');

const API = require('../helpers/APIWrapper');
let user;


const registerAndLogin = async (email = 'e2e@test.com', register = true, touch = true) => {
    if(register) {
        const registered = await API.register(email);
        assert(registered, "Did not register the user");
        await new Promise(r => setTimeout(r, 1000));
    }
    const login = await API.login(email);
    assert(login, "Did not login to the platform");
    user = await API.getUser();
    assert(user && user.email === email, "Did not get the user");
    user = new User(user);
    if(touch) {
        const touched = await API.touchUser();
        assert(touched, "Did not touch the user's connection time");
    }
    return true;
};

describe('User flow', () => {

    it('should be able to register a user', done => {

        new Promise(async() => {
            const registered = await API.register('e2e@test.com');
            assert(registered, "Did not register the user");
            await new Promise(r => setTimeout(r, 1000));
            done();
        });
    });

    it('should be able to login with a user', done => {
        new Promise(async() => {
            const login = await API.login('e2e@test.com');
            assert(login, "Did not login to the platform");
            done();
        });
    });

    it('should be able to get your own user when authenticated', done => {
        new Promise(async() => {
            user = await API.getUser();
            assert(user && user.email === 'e2e@test.com', "Did not get the user");
            user = new User(user);
            done();
        });
    });

    it('should be able to update last_connection by touch', done => {
        new Promise(async() => {
            const touched = await API.touchUser();
            assert(touched, "Did not touch the user's connection time");
            done();
        });
    });



});
