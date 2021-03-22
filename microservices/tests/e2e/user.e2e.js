const { assert } = require('../../../utilities/assert');
const {ORM, createServer, Router} = require('../../shared/index');
const User = require('../../shared/models/User.model');
const Content = require('../../shared/models/Content.model');
const UserService = require('../../shared/services/User.service');
const MessageQueueService = require('../../shared/services/MessageQueue.service');
const open = require('open');

const API = require('../helpers/APIWrapper');
let user;

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

    it('should be able to post content from a user', done => {
        new Promise(async() => {
            const content = new Content();
	        content.text = 'This is just some test content';
	        content.user_id = user.id;
	        content.wealth = user.wealth;
	        console.log('content', content);


            const posted = await API.postContent(content);
            console.log('posted', posted);
            assert(posted, "Did not post content");
            done();
        });
    });



});
