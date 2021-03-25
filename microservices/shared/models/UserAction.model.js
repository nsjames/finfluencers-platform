const {createModel} = require('../utils/models.util');
const {getOrDefault} = require('../utils/getOrDefaultProp');
const Asset = require('./Asset.model');

const FIELDS = {
    id:'string',
    user_id:'string',
    type:'number',
    data:'any'
};

const METHODS = {
    index(){
        return this.rawIndex(this.id);
    },
    constructor(json){
        if(!json.hasOwnProperty('type') || !json.type) json.type = 0;
        if(!Object.values(USER_ACTION_TYPE).includes(json.type)) throw "Invalid user action type";
    },
};

export default createModel('UserAction', FIELDS, METHODS);

export const USER_ACTION_TYPE = {
    SAVINGS:0,
    INVESTMENT:1,
    LIQUIDATION:2,
    INCOME:3,
    EXPENSE:4,
};

export class UserActionSavings {
	constructor(json = {}){
		this.saved = getOrDefault(json, 'saved', new Asset(), Asset);
	}
}

export class UserActionInvestment {
	constructor(json = {}){
		this.label = getOrDefault(json, 'label', '');
		this.monthly_revenue = getOrDefault(json, 'monthly_revenue', new Asset(), Asset);
		this.monthly_expense = getOrDefault(json, 'monthly_expense', new Asset(), Asset);
		this.term_length_in_seconds = getOrDefault(json, 'term_length_in_seconds', 0);
	}
}

export class UserActionLiquidation {
	constructor(json = {}){
		this.user_action_id = getOrDefault(json, 'user_action_id', '');
		this.asset = getOrDefault(json, 'asset', new Asset(), Asset);
	}
}

export class UserActionIncome {
	constructor(json = {}){
		this.asset = getOrDefault(json, 'asset', new Asset(), Asset);
		this.date = getOrDefault(json, 'date', +new Date());
	}
}

export class UserActionExpense {
	constructor(json = {}){
		this.asset = getOrDefault(json, 'asset', new Asset(), Asset);
		this.date = getOrDefault(json, 'date', +new Date());
	}
}
