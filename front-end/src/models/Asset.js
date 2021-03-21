import {getOrDefault} from "../util/getOrDefaultProp";

export class Asset {

	constructor(json = {}){
		this.id = getOrDefault(json, 'id', '');
		this.asset = getOrDefault(json, 'asset', '');
		this.amount = getOrDefault(json, 'amount', 0);
	}

}
