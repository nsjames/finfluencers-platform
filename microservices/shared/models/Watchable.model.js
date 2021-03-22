const {createModel} = require('../utils/models.util');
const {sha256} = require('../utils/crypto.util');

const FIELDS = {
    user_platform_index:'string',
	platform_type:'string',
    last_checked:'number',
    interval:'number'
};

const METHODS = {
    index(){
        return this.rawIndex(this.user_platform_index);
    },
    constructor(json){
        if(!json.hasOwnProperty('interval') || typeof json.interval !== 'number'){
            // Default intervals, these expand and contract as we notice more or less
            // interactions required for tracking.
	        json.interval = (() => {
		        switch ((json.platform_type)) {

			        default: return 60;
		        }
	        })() * 1000;
        }
    }
};

module.exports = createModel('Watchable', FIELDS, METHODS);
