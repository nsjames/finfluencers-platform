const {createModel} = require('../utils/models.util');

const FIELDS = {
    content_id:'string',
    influence_delta:'number',
    date:'number',
};

const METHODS = {
    index(){
        return this.rawIndex(this.id);
    },
    constructor(json){

    },
};

module.exports = createModel('PredictionResult', FIELDS, METHODS);
