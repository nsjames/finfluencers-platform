const ORM = require('../orm');
const Results = require('../models/Results.model');
const Content = require('../models/Content.model');
const PredictionResult = require('../models/PredictionResult.model');
const Interaction = require('../models/Interaction.model');
const TokenPrice = require('../models/TokenPrice.model');
const {CONTENT_TYPE} = require('../models/ContentType');
const {INTERACTION_TYPE} = require('../models/InteractionType');
const MessageQueueService = require('./MessageQueue.service');
const ContentService = require('./Content.service');
const couchbase = require('couchbase');
const UserService = require('../services/User.service');

module.exports = class PredictionService {

    static async checkPredictions(){
    	const date = +new Date();
    	const appliedQuery = '`data.applied` = 0';
        const openPredictions = await ORM.query(
        	`SELECT * FROM BUCKET_NAME WHERE doc_type = 'content' AND soft_delete = 0 AND type = ${CONTENT_TYPE.PREDICTION} AND ${appliedQuery} AND data.date <= ${date}`,
        Content);

        console.log('Open Predictions:', openPredictions.length);
        for(let i = 0; i < openPredictions.length; i++){
	        await MessageQueueService.emit('resolve-prediction', openPredictions[i]);
        }
    }

    static async resolvePrediction(content){
    	const date = +new Date();
	    content = new Content(content);

	    if(!!(await ContentService.getById(content.id)).data.applied){
	    	return true;
	    }

	    console.log('Resolving prediction:', content.id);

	    // Setting the applied first, to cure re-entrance.
		if(!await ORM.getBucket().mutateIn(content.index(), [
			couchbase.MutateInSpec.upsert("data.applied", 1),
		]).catch(err => {
			console.error("mutate resolve prediction error", err);
			return false;
		})) return MessageQueueService.emit('resolve-prediction', JSON.parse(JSON.stringify(content)));

		const hearts = await ORM.query(`SELECT COUNT(*) FROM BUCKET_NAME WHERE doc_type = 'interaction' AND parent_index = 'content:${content.id}' AND type = ${INTERACTION_TYPE.HEART}`);
		const helpedMeComments = await ORM.query(`SELECT COUNT(*) FROM BUCKET_NAME WHERE doc_type = 'interaction' AND parent_index = 'content:${content.id}' AND type = ${INTERACTION_TYPE.CONTENT_RESOLUTION} AND data > 0`);
		const hurtMeComments = await ORM.query(`SELECT COUNT(*) FROM BUCKET_NAME WHERE doc_type = 'interaction' AND parent_index = 'content:${content.id}' AND type = ${INTERACTION_TYPE.CONTENT_RESOLUTION} AND data < 0`);

		let prices = await ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'tokenprice' AND id = '${content.data.asset.id}' AND date > ${content.data.date - (86400000)} AND date < ${content.data.date + (86400000)}`, TokenPrice)
		const priceAtClose = prices.reduce((acc,x) => {
			if(x.date >= acc.date && acc.date <= content.data.date) return x;
			return acc;
		});
		const priceAtStart = prices.reduce((acc,x) => {
			if(x.date >= acc.date && acc.date <= content.created_at) return x;
			return acc;
		});

	    const isSuccessfulPrediction = false;
	    const priceBuffer = content.data.price / (content.data.price/10);

	    const predictedPnL = parseFloat((content.data.price-priceAtStart.price)/content.data.price*100.0);
	    const actualPnL = parseFloat((priceAtClose.price-priceAtStart.price)/priceAtClose.price*100.0);

	    // TODO: Instead of using a buffer, we can allocate influence based on the distance from the prediction vs the influence of the post.
	    // For instance, if 100 hearts but there's a 10% distance, we only give 90% of the hearts as processed influence.
	    const buffer = Math.abs(predictedPnL) * 0.05;
	    const predictedBufferDown = predictedPnL - buffer;
	    const predictedBufferUp = predictedPnL + buffer;

	    let influenceDelta = 0;
	    if(actualPnL <= predictedBufferUp && actualPnL >= predictedBufferDown){
	    	// Success!
		    influenceDelta += hearts + helpedMeComments;
	    } else {
	    	// Failure!
		    influenceDelta -= hearts + hurtMeComments;
	    }

	    // TODO: Another way to use distance to impact the influence is by multiplying the delta with
	    // the diff in distance between the prediction in the actual result.

	    const result = await UserService.deltaInfluence(influenceDelta, content.user_id);
	    if(!result){
	    	console.error('Error resolving prediction. Content: ', content.id, ' Date: ', date, ' Influence delta: ', influenceDelta);
	    } else {
	    	// Just creating a record
		    // TODO: Add to blockchain
	    	const predictionResult = new PredictionResult({
			    content_id:content.id,
			    influence_delta:influenceDelta,
			    date,
		    });
	    	await ORM.upsert(predictionResult);
	    }







    }

}
