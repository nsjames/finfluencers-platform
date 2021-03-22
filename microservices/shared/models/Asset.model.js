const {getOrDefault} = require('../utils/getOrDefaultProp');

module.exports = class Asset {

	constructor(json = {}){
		this.id = getOrDefault(json, 'id', '');
		this.asset = getOrDefault(json, 'asset', '');
		this.amount = getOrDefault(json, 'amount', 0);
	}

}
