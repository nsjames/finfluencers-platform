const BlockchainService = require("./BlockchainService").default;

const store = require('../store/index').default;
const {Snackbar} = require('../models/Snackbar');

const {sha256} = require('@finfluencers/shared/utils/crypto.util');

const HOST = process.env.VUE_APP_API_BALANCER;
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


const regenUser = async (pass = null) => {
	const user = await ApiService.getSelfUser();
	console.log('self user', user);
	if(!user) return false;

	const key = await ApiService.getEncryptedKey();
	if(pass) BlockchainService.decryptAndLoad(key.encrypted, pass);
	else BlockchainService.loadKey(key.encrypted);

	return store.dispatch('setUser', user);
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
		return regenUser();
	},
	isNameAvailable(name){
		return GET(`users/name/${encodeURIComponent(name)}`);
	},
	checkActivationCode:async(code) => {
		const hash = sha256(code);
		return GET(`users/find-code/${hash}`)
	},
	register:async(name, email, password, code, data) => {
		const keys = await BlockchainService.generateKey(password);
		return POST('users/register', {
			email,
			name,
			auth:{type:1, data:password},
			code,
			data,
			keys,
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
				token = _token;
				localStorage.setItem('token', token);

				await regenUser(pass);

				return true;
			}
			return false;
		})
	},
	postContent:async(content) => {
		content.user_id = store.state.user.id;
		content.created_at = +new Date();
		console.log('content', JSON.parse(JSON.stringify(content)));
		const data = content.data ? `:${JSON.stringify(content.data)}` : '';
		content.signature = await BlockchainService.sign(sha256(`content:${content.user_id}:${content.created_at}:${content.type}:${content.text.data}:${data}`));
		if(!content.signature) {
			Snackbar.error("Cannot post content without a signature");
			return false;
		}
		return POST('contents', content)
	},
	getSelfUser:async() => {
		return GET('users/user')
	},
	getEncryptedKey:async() => {
		return GET('users/encrypted-key')
	},
	getUser:async(name) => {
		return GET(`users/user/${encodeURIComponent(name)}`)
	},
	async touchUser(){
		return GET(`users/touch`);
	},
	async getContent(id){
		return GET(`contents/${id}`);
	},
	async setFeedContents(options = {}){
		if(!options.feedType) options.feedType = store.state.feedType;
		const feed = await POST('contents/feed', options);
		if(feed) store.dispatch('setContents', feed);
	},
	async postComment(comment){
		return POST(`comments`, comment);
	},
	async getComments(parent){
		return GET(`comments/${parent}`);
	},
	interactContent(content, type){
		return POST(`contents/interact/${content.id}`, {type});
	},
	deleteContent(content){
		return GET(`contents/delete/${content.id}`);
	},
	subscribe(user_id){
		return GET(`users/subscribe/${user_id}`);
	},
	searchAssets(symbolOrName){
		return GET(`search/tokens/${encodeURIComponent(symbolOrName)}`)
	},
	search(terms){
		return GET(`search/terms/${encodeURIComponent(terms)}`)
	}
}

module.exports = ApiService;
