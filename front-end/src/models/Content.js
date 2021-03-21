import {getOrDefault} from "../util/getOrDefaultProp";
import {Asset} from "./Asset";

export const CONTENT_TYPE = {
	TEXT:0,
	TRADE:1,
	PREDICTION:2,
	PORTFOLIO:3,
};

export class Content {

	constructor(json = {}){
		this.doc_type = 'content';

		this.id = getOrDefault(json, 'id', null);
		this.user_id = getOrDefault(json, 'user_id', 0);
		this.created_at = getOrDefault(json, 'created_at', +new Date());
		this.type = getOrDefault(json, 'type', CONTENT_TYPE.TEXT);
		// Data format is based off of the type
		this.data = getOrDefault(json, 'data', null);
		this.text = getOrDefault(json, 'text', new TextContent(), TextContent);
		// Array of tags
		this.tags = getOrDefault(json, 'tags', []);
		// The WEALTH score of the user at the time of posting
		this.wealth = getOrDefault(json, 'wealth', 0);
	}

}

export class TextContent {
	constructor(json = {}){
		this.text = getOrDefault(json, 'text', '');
	}
}

export class TradeContent {
	constructor(json = {}){
		this.from = getOrDefault(json, 'from', new Asset(), Asset);
		this.to = getOrDefault(json, 'to', new Asset(), Asset);
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
