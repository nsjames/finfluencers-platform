const { assert } = require('../../../utilities/assert');

const {createServer} = require('@finfluencers/shared');
const routeGenerator = require('../routes');
const UserService = require('@finfluencers/shared/services/User.service');
const User = require('@finfluencers/shared/models/User.model');
const ORM = require('@finfluencers/shared/orm');

let server;
let host;

// TODO: Flesh out tests more
describe('Authentication', () => {

    it('should raise a server', done => {
        new Promise(async() => {

            server = await createServer(null, routeGenerator);
            const port = server[1]._connectionKey.split(':').filter(x => !!x.length)[1];
            host = `http://localhost:${port}`;

            done();
        });
    });

    it('should be able to login', done => {
        new Promise(async() => {
            await UserService.insert(new User({
                doc_type: 'user',
                id: '5bbbca3b-93c6-4fa7-8112-2140e36e5a4e',
                name: 'passport',
                email: 'passport@test.com',
                auth: {
                    type:1,
                    // cleartext: "1111"
                    data:'1111'
                }
            }));

            let token = null;

            await (async () => {
                const result = await fetch(`${host}/authenticate`, {
                    method:"POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({
                        email:'passport@test.com',
                        pass:'1111'
                    }),
                }).then(x => {
                    return x.json();
                }).catch(err => {
                    console.error(err);
                    return false;
                });

                assert(result && !result.error, "Did not get a token!");
                token = result.data;
            })();

            // await (async () => {
            //     const result = await fetch(`${host}/authenticate`, {
            //         headers:{
            //             'X-Auth-Token':token,
            //         }
            //     }).then(x => {
            //         if(x.status === 401) return null;
            //         return x.json();
            //     }).catch(err => {
            //         console.error(err);
            //         return false;
            //     });
            //     assert(result && result.name === 'passport', "Did not prove authentication");
            // })();

            done();
        });
    });


});
