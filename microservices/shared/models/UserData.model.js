const {createModel} = require('../utils/models.util');

const FIELDS = {
	user_id:'string',
    defaultType:'number',
    monthlyIncome:'number',
    monthlyExpenses:'number',
    goals:'any',
    strengths:'any',
};

const METHODS = {
    index(){
        return this.rawIndex(this.user_id);
    },
    constructor(json){

    },
};

module.exports = createModel('UserData', FIELDS, METHODS);
