import {getOrDefault} from "../util/getOrDefaultProp";

export class User {

	constructor(json = {}){
		this.doc_type = 'user';

		this.id = getOrDefault(json, 'id', null);
		this.name = getOrDefault(json, 'name', '');
		this.created_at = getOrDefault(json, 'created_at', 0);
		this.wealth = getOrDefault(json, 'wealth', 0);
		this.public_key = getOrDefault(json, 'public_key', null);
	}

}
