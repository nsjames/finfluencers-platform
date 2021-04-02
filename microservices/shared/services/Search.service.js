
const ORM = require('../orm');
const Results = require('../models/Results.model');
const User = require('../models/User.model');
const Content = require('../models/Content.model');

module.exports = class SearchService {

    static async search(terms){
        const users = await ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'user' AND UPPER(name) LIKE '%${terms.toUpperCase()}%'`, User).then(x => x.map(x => x.safer()));
        const content = await ORM.query(`SELECT * FROM BUCKET_NAME WHERE doc_type = 'content' AND soft_delete = 0 AND UPPER(text.data) LIKE '%${terms.toUpperCase()}%'`, Content);

        return {
        	users,
	        content
        }
    }

}
