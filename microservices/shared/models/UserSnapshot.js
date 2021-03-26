const {getOrDefault} = require('../utils/getOrDefaultProp');
const Asset = require('./Asset.model');

module.exports = class UserSnapshot {
	constructor(json = {}){
		this.potential = getOrDefault(json, 'potential', 0);
		this.influence = getOrDefault(json, 'influence', 0);
		this.value = getOrDefault(json, 'value', 0);
		this.subscribers = getOrDefault(json, 'subscribers', 0);
	}
}
