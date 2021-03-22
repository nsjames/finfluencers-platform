const {getOrDefault} = require('../utils/getOrDefaultProp');
const Asset = require('./Asset.model');

export class TextContent {
	constructor(json = {}){
		this.data = getOrDefault(json, 'data', '');
	}
}

export class TradeContent {
	constructor(json = {}){
		this.from = getOrDefault(json, 'from', new Asset(), Asset);
		this.to = getOrDefault(json, 'to', new Asset(), Asset);
		this.sandboxed = getOrDefault(json, 'sandboxed', false);
	}
}

export class PredictionContent {
	constructor(json = {}){
		this.asset = getOrDefault(json, 'asset', '');
		this.price = getOrDefault(json, 'price', 0);
		this.date = getOrDefault(json, 'date', +new Date() + (60*60*24*7*1000));
	}
}

export class PortfolioContent {
	constructor(json = {}){
		this.portfolio = getOrDefault(json, 'portfolio', null);
	}
}
