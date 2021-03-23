const store = require('../store/index').default;
const {Snackbar} = require('../models/Snackbar');

const {sha256} = require('@finfluencers/shared/utils/crypto.util');

const HOST = 'http://localhost:40406';
let token = localStorage.getItem('token') || null;

const getHeaders = (api_key = false) => {
	const headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
	if(api_key) headers['X-Auth-Token'] = store.state.user.apiKey;
	else {
		if(token) headers['X-Auth-Token'] = token;
	}
	return headers;
};

const POST = (route, data, api_key = false) => fetch(`${HOST}/${route}`, {
	method:"POST",
	headers: getHeaders(api_key),
	body:JSON.stringify(data)
}).then(x => x.status === 200 ? x.json() : null).then(x => {
	// console.log(route, x);
	if(!x) return null;
	if(x.error){
		Snackbar.error(x.details);
		console.error(x);
		return null;
	}

	return x.data;
}).catch(err => {
	Snackbar.error(err);
	console.error(err);
	return null;
});

const GET = (route, api_key = false) => fetch(`${HOST}/${route}`, {
	method:"GET",
	headers: getHeaders(api_key),
}).then(x => x.status === 200 ? x.json() : null).then(x => {
	// console.log(route, x);
	if(!x) return null;
	if(x.error){
		Snackbar.error(x.details);
		console.error(x);
		return null;
	}

	return x.data;
}).catch(err => {
	Snackbar.error(err);
	console.error(err);
	return null;
});


const regenUser = async () => {
	const user = await ApiService.getSelfUser();
	if(!user) return false;
	console.log('user', user);

	store.dispatch('setUser', user);
};

const ApiService = {
	hasToken(){
		return !!token;
	},
	clearToken(){
		token = null;
		localStorage.removeItem('token')
	},
	checkUser(){
		regenUser();
	},
	checkActivationCode:async(code) => {
		const hash = sha256(code);
		return GET(`users/find-code/${hash}`)
	},
	register:async(email, password, code) => {
		return POST('users/register', {
			email,
			name:email.split('@')[0],
			auth:{type:1, data:password},
			code,
		}).then(x => {
			if(!x) return false;
			return ApiService.login(email, password);
		})
	},
	login:async(email, pass) => {
		return POST('authentication/authenticate', {
			email,
			pass,
		}).then(async _token => {
			if(_token) {
				console.log('token', _token);
				token = _token;
				localStorage.setItem('token', token);

				await regenUser();

				return true;
			}
			return false;
		})
	},
	postContent:async(content) => {
		return POST('contents', content)
	},
	getSelfUser:async() => {
		return GET('users/user')
	},
	getUser:async(name) => {
		return GET(`users/user/${encodeURIComponent(name)}`)
	},
	async touchUser(){
		return GET(`users/touch`);
	},
	async setFeedContents(options = {}){
		const feed = await POST('contents/feed', options);
		console.log('feed', feed);
		if(feed) store.dispatch('setContents', feed);
	},
}

module.exports = ApiService;