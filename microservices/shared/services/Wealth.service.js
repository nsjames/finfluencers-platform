const ORM = require('../orm');

const MAX_WEALTH_INDEX = 'wealth:max';

module.exports = class WealthService {

    static async getMaxWealth(){
        return ORM.get(MAX_WEALTH_INDEX).catch(err => {
            console.error("Error getting max wealth", err);
            return 0;
        });
    }

    static async setMaxWealth(wealth = 0){
        return ORM.upsert(wealth, MAX_WEALTH_INDEX);
    }

    static async calculateWealth(user){
        const maxWealth = await this.getMaxWealth();
        if(maxWealth) return 0;
        const userWealth = user.wealth;
        return userWealth / maxWealth;
    }

    static async deltaWealth(user, delta){
        return ORM.getBucket().mutateIn(user.index(), [
	        couchbase.MutateInSpec.increment("wealth", delta),
        ]).catch(err => {
	        console.error("Did not add wealth", err);
	        return false;
        })
    }

}
