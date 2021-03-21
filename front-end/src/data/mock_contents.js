import {Content, CONTENT_TYPE, PortfolioContent, PredictionContent, TextContent, TradeContent} from "../models/Content";
import {Asset} from "../models/Asset";

const abc = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('')
const randomSymbol = (length = 3) => [...Array(length).keys()].map(x => Math.round(Math.random() * 26)).map(x => abc[x]).join('');

const randomAsset = () => {
	return new Asset({asset:randomSymbol(Math.round(Math.random() * 3)+2), amount:Math.round(Math.random()*10000)})
};

let contentId = 0;
const createContent = () => {
	let content = new Content({id:contentId});
	content.type = Math.round(Math.random()* 3);
	content.text = new TextContent({text:'This is some test text'});


	if(content.type === CONTENT_TYPE.TRADE)
		content.data = new TradeContent({from:randomAsset(), to:randomAsset()});

	if(content.type === CONTENT_TYPE.PREDICTION)
		content.data = new PredictionContent({asset:randomSymbol(Math.round(Math.random() * 5)+2), price:parseFloat(Math.random() * 100).toFixed(2)});

	if(content.type === CONTENT_TYPE.PORTFOLIO)
		content.data = new PortfolioContent({portfolio:{
			// TODO: Hmm
		}});

	contentId++;
	return content;
};

export default [...Array(50).keys()].map(createContent);
