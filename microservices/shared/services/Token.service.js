
const ORM = require('../orm');
const Results = require('../models/Results.model');
const TokenPrice = require('../models/TokenPrice.model');
const CachedToken = require('../models/CachedToken.model');

const headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
    'X-CMC_PRO_API_KEY':process.env.CMC_KEY
};

const HOST = 'https://pro-api.coinmarketcap.com';
const GET = route => fetch(`${HOST}/${route}`, Object.assign({headers}, {method:"GET"})).then(x => x.json());
const POST = (route, data) => fetch(`${HOST}/${route}`, Object.assign({headers}, {
    method:"POST",
    data:JSON.stringify(data)
})).then(x => x.json());

const FETCH_LIMIT = 5000;
const STALE_TIME = 60*30*1000;

module.exports = class TokenService {

    static async getLastFetchTime(){
       return ORM.get(`last_token_fetch_time`).catch(() => 0);
    }

    static async setLastFetchTime(){
        return ORM.upsert(+new Date(), `last_token_fetch_time`);
    }

    static async cacheTokenList(startIndex = 1, running = false, date = null){
        if(!running) {
	        const lastFetch = await this.getLastFetchTime();
	        if (lastFetch > 0 && lastFetch > (+new Date() - STALE_TIME)) return;
        }

	    await this.setLastFetchTime();

	    if(!date) date = +new Date();

	    console.log('Caching token list', startIndex, (new Date(date)).toUTCString());

        const results = await GET(`v1/cryptocurrency/listings/latest?start=${startIndex}&limit=${FETCH_LIMIT}&aux=platform&sort=volume_30d&sort_dir=desc`).then(x => x.data).catch(() => []);
        if(results.length){
            for(let i = 0; i < results.length; i++){
                const data = results[i];

	            const cachedToken = new CachedToken({
		            id:data.id.toString(),
		            name:data.name,
		            symbol:data.symbol,
		            platform:data.platform ? data.platform.symbol : data.symbol,
		            contract:data.platform ? data.platform.token_address : '',
	            });

	            // Only need to insert if it doesn't already exist
	            await ORM.insert(cachedToken).catch(() => {});


	            const tokenPrice = new TokenPrice({
		            id:data.id.toString(),
		            price:data.quote.USD.price.toString(),
		            date:+new Date(data.quote.USD.last_updated)
	            });

	            await ORM.upsert(tokenPrice);
            }

            // Don't need any more than this as we're sorting by volume_30d
            if(startIndex > FETCH_LIMIT*2) return;
            // Get another round
            return this.cacheTokenList(startIndex+FETCH_LIMIT, true, date);
        }
    }

    static async search(term){
	    term = term.toUpperCase();

        return ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'cachedtoken' AND (UPPER(name) LIKE '${term}%' OR UPPER(symbol) LIKE '${term}%') ORDER BY symbol LIMIT 20`, CachedToken).then(tokens => {
            return tokens.sort((a,b) => {
	            if(b.name.toUpperCase() === term || b.symbol.toUpperCase() === term) return 1;
	            return -1;
            })
        })
    }

    static async getPriceHistory(id, start = 0, end = +new Date()){
	    // TODO: Get a maximum amount of prices, based on the diff between start and end.
	    // Examples:
	    // - 3 day diff, 12 prices per day
	    // - 4 hour diff: 2 prices per hour
	    // - 30 day diff: 1 price per day
        return ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'tokenprice' AND id = '${id}' AND created_at BETWEEN ${start} AND ${end} ORDER BY created_at DESC LIMIT ${24 * STALE_TIME / 30 / 1000}` /* 30 days worth */, TokenPrice);
    }

}
