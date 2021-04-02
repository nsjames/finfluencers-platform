import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { PrivateKey } from 'eosjs/dist/PrivateKey';
import ecc from 'eosjs-ecc';
import AES from 'aes-oop';
import Popup from '../models/Popup';

let wif = null;
let isDecrypted = false;

export default class BlockchainService {

	static async generateKey(password){
		const privateKey = await ecc.PrivateKey.randomKey();
		wif = privateKey.toWif().toString();
		isDecrypted = true;
		return {
			encrypted:AES.encrypt(wif, ecc.sha256(password)),
			public:privateKey.toPublic().toString()
		};
	}

	static loadKey(key){
		wif = key;
	}

	static decryptAndLoad(encryptedKey, password){
		try {
			wif = AES.decrypt(encryptedKey, ecc.sha256(password));
			isDecrypted = true;
			return true;
		} catch(e){
			console.error('Error decrypting key', e);
			return false;
		}
	}

	static decryptKey(password){
		return this.decryptAndLoad(wif, password);
	}

	static async sign(data){
		if(!isDecrypted) {
			await new Promise(async resolve => {
				(new Popup('unlock-key', {resolve})).open();
			});

			if(!isDecrypted) return;
		}


		return PrivateKey.fromString(wif).sign(data).toString();
	}

}
