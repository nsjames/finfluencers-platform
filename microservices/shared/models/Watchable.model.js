const {createModel} = require('../utils/models.util');
const {sha256} = require('../utils/crypto.util');
const PLATFORM_TYPES = require('../services/platforms/PLATFORM_TYPES');

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
			        case PLATFORM_TYPES.YOUTUBE: return 60;
			        case PLATFORM_TYPES.INSTAGRAM: return 60;
			        default: return 60;
		        }
	        })() * 1000;
        }
    }
};

module.exports = createModel('Watchable', FIELDS, METHODS);
