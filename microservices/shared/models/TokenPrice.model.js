const {createModel} = require('../utils/models.util');

const FIELDS = {
    id:'string',
    price:'string',
    date:'number'
};

const METHODS = {
    index(){
        return this.rawIndex(this.id, this.date.toString());
    },
};

module.exports = createModel('TokenPrice', FIELDS, METHODS);
