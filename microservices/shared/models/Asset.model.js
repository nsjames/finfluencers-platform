const {getOrDefault} = require('../utils/getOrDefaultProp');

module.exports = class Asset {

	constructor(json = {}){
		this.id = getOrDefault(json, 'id', '');
		this.symbol = getOrDefault(json, 'symbol', '');
		this.amount = getOrDefault(json, 'amount', 0);
	}

}
