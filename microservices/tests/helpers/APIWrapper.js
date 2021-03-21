const logger = require('../../../utilities/logger');

const HOST = 'http://localhost:40406';
let token;

const getHeaders = post => {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    if(token) headers['X-Auth-Token'] = token;
    return headers;
};

const POST = (route, data) => fetch(`${HOST}/${route}`, {
    method:"POST",
    headers: getHeaders(true),
    body:JSON.stringify(data)
}).then(x => x.status === 200 ? x.json() : null).then(x => {
    // console.log(route, x);
    if(!x) return null;
    if(x.error){
        logger.error('Api Wrapper POST error', route, x);
        return null;
    }

    return x.data;
}).catch(err => {
    console.error(err);
    return null;
});

const GET = (route) => fetch(`${HOST}/${route}`, {
    method:"GET",
    headers: getHeaders(false),
}).then(x => x.status === 200 ? x.json() : null).then(x => {
    // console.log(route, x);
    if(!x) return null;
    if(x.error){
	    logger.error('Api Wrapper GET error', route, x);
        return null;
    }

    return x.data;
}).catch(err => {
    console.error(err);
    return null;
});


module.exports = {
    clearToken(){
        token = null;
    },
    register:async(email) => {
        return POST('users/register', {
            email,
            name:email.split('@')[0],
            auth:{type:1, data:'1111'},
        })
    },
    login:async(email, pass = '1111') => {
        return POST('authentication/authenticate', {
            email,
            pass,
        }).then(_token => {
            if(_token) token = _token;
            return _token;
        })
    },
    getUser:async() => {
        return GET('users/user')
    },
    async touchUser(){
        return GET(`users/touch`);
    },


    admin:{
        connectedUsers(){
            return GET('admin/connected');
        },
    }
}
