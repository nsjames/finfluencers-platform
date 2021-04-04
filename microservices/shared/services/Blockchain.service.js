const ORM = require('../orm');
const AuthToken = require('../models/AuthToken.model');
const uuid = require('../utils/uuid.util');
const {sha256, SALT} = require('../utils/crypto.util');
const UserService = require('./User.service');
const Results = require('../models/Results.model');

const murmur = require('murmurhash').v2;

const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const { TextEncoder, TextDecoder } = require('util');

const encode = auth => {
    return `${auth.id}:${sha256(`${auth.nonce}:${auth.user_index}:${auth.ip}:${auth.expiration}`)}`;
};

const KEYS = {};

const HOSTS = process.env.BLOCKCHAIN_HOSTS.split(',');

let nextChain = 0;
let nextHost = {};
const CHAINS = {};


const getNextChain = () => {
    nextChain++;
	return Object.keys(CHAINS)[nextChain % Object.keys(CHAINS).length];
};

const getNextHost = (chain) => {
	nextHost[chain]++;
	return Object.values(CHAINS[chain])[nextHost[chain] % Object.values(CHAINS[chain]).length];
};

HOSTS.map(async host => {
    const info = await fetch(`${host}/v1/chain/get_info`).then(x => x.json()).catch(() => null);
    if(!info) return;
    if(!nextHost[info.chain_id]) nextHost[info.chain_id] = 0;
    if(!CHAINS[info.chain_id]) CHAINS[info.chain_id] = [];
    CHAINS[info.chain_id].push(host);
    KEYS[info.chain_id] = (keys => {
    	return keys.find(x => x.indexOf(':') === -1 || x.split(':')[0] === info.chain_id);
    })(process.env.BLOCKCHAIN_KEYS.split(','))
});

module.exports = class BlockchainService {

	static async pushTransaction(chain, actions){
		if(!Object.keys(CHAINS).length) {
			console.error("No blockchains are live.");
			return true;
		}

		const signatureProvider = new JsSignatureProvider([KEYS[chain]]);
		const chainHost = getNextHost(chain);
		const rpc = new JsonRpc(chainHost, { fetch });
		const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
		actions = actions.map(action => ({
			account:action.contract,
			name:action.action,
			authorization:[{
				actor:action.contract,
				permission:'active',
			}],
			data:action.data
		}));

		return api.transact({
			actions
		}, {
			blocksBehind: 3,
			expireSeconds: 30,
		});
	}

	static async getData(chain, table, scope = 'data', rows = []){
		if(!Object.keys(CHAINS).length) {
			console.error("No blockchains are live.");
			return [];
		}

		const chainHost = getNextHost(chain);
		const rpc = new JsonRpc(chainHost, { fetch });

		return rpc.get_table_rows({
			json:true,
			code:'data',
			scope,
			table,
		}).then(x => {
			if(x.more) return this.getData(chain, table, scope, x.rows.concat(rows));
			return x.rows.concat(rows);
		});
	}

	static getChainId(){
		return getNextChain();
	}

    static async user(user){
        const result = await this.pushTransaction(user.chain_id, [{
		    contract: 'data',
		    action: 'user',
		    data:{
			    user:{
				    id:murmur(user.id),
				    key:user.keys.public,
				    document:JSON.stringify(user.safer())
			    }
		    }
	    }]).catch(err => {
	    	console.error("Error pushing user to blockchain", JSON.stringify(err));
	    	return null;
        });

        console.log('Blockchain result', result);

        return !!result;
    }

    static async post(content, user){
	    const result = await this.pushTransaction(content.chain_id, [{
		    contract: 'data',
		    action: 'post',
		    data:{
			    content:{
				    id:murmur(content.id),
				    user_id:murmur(user.id),
				    document:JSON.stringify(content)
			    }
		    }
	    }]).catch(err => {
		    console.error("Error pushing content to blockchain", JSON.stringify(err));
		    return null;
	    });

	    console.log('Blockchain result', result);

	    return !!result;
    }

    static async interact(interaction, user){
	    const result = await this.pushTransaction(user.chain_id, [{
		    contract: 'data',
		    action: 'interact',
		    data:{
			    interaction:{
				    id:murmur(interaction.id),
				    user_id:murmur(user.id),
				    document:JSON.stringify(interaction)
			    }
		    }
	    }]).catch(err => {
		    console.error("Error pushing interaction to blockchain", JSON.stringify(err));
		    return null;
	    });

	    console.log('Blockchain result', result);

	    return !!result;
    }

    static async uninteract(interaction_id, user){
	    const result = await this.pushTransaction(user.chain_id, [{
		    contract: 'data',
		    action: 'uninteract',
		    data:{
			    id:murmur(interaction_id),
		    }
	    }]).catch(err => {
		    console.error("Error pushing uninteract to blockchain", JSON.stringify(err));
		    return null;
	    });

	    console.log('Blockchain result', result);

	    return !!result;
    }

    static async portfolio(user, content_id, assets){
	    const result = await this.pushTransaction(user.chain_id, [{
		    contract: 'data',
		    action: 'portfolio',
		    data:{
			    user_id:murmur(user.id),
			    portfolio:{
			    	timestamp:parseInt(+new Date() / 1000),
				    content_id:murmur(content_id),
				    assets,
			    }
		    }
	    }]).catch(err => {
		    console.error("Error pushing portfolio to blockchain", JSON.stringify(err), err);
		    return null;
	    });

	    console.log('Blockchain result', result);

	    return !!result;
    }

    static async getPortfolio(user){
		const portfolio = await this.getData(user.chain_id, 'portfolios', murmur(user.id));
		if(!portfolio || !portfolio.length) return [];
		return portfolio.sort((a,b) => {
			if(b.timestamp > a.timestamp) return 1;
			if(b.timestamp < a.timestamp) return -1;
			return 0;
		})[0].assets;
    }

    static async checkActivationCode(code){
        return true;
    }

    static async claimActivationCode(code, user_id){
        return true;
    }

    static async postContent(user_id, content){

    }

}
