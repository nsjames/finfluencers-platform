const UserSnapshot = require("./UserSnapshot");

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
		this.snapshot = getOrDefault(json, 'snapshot', new UserSnapshot(), UserSnapshot);
		this.options = getOrDefault(json, 'options', []);
	}
}

export const PORTFOLIO_OPTIONS = {
	NONE:0,
	TOTAL_INVESTED:1,
	TOTAL_VALUE:2,
	// SAVED_VS_EARNED:3,
	// AVERAGE_RETURNS:4,
}

export const portfolioOptionToText = option => {
	switch(option){
		case PORTFOLIO_OPTIONS.NONE: return 'None';
		case PORTFOLIO_OPTIONS.TOTAL_INVESTED: return 'Assets';
		case PORTFOLIO_OPTIONS.TOTAL_VALUE: return 'Cash';
	}
};
