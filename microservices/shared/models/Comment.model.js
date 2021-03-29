const {createModel} = require('../utils/models.util');

const FIELDS = {
    id:'string',
    user_id:'string',
    parent_index:'string',
	top_level_parent_index:'string',
    text:'string',
	resolution:'string',
};

const METHODS = {
    index(){
        return this.rawIndex(this.id);
    },
    constructor(json){
		if(!json.hasOwnProperty('user_id')) json.user_id = '';
		if(!json.hasOwnProperty('parent_index')) json.parent_index = '';
		if(!json.hasOwnProperty('top_level_parent_index')) json.top_level_parent_index = '';
		if(!json.hasOwnProperty('text')) json.text = '';
		if(!json.hasOwnProperty('resolution')) json.resolution = '';
    },
	topLevelParentType(){
    	return this.top_level_parent_index.split(':')[0];
	},
	topLevelParentId(){
    	return this.top_level_parent_index.split(':')[1];
	},
	parentType(){
    	return this.parent_index.split(':')[0];
	},
	parentId(){
    	return this.parent_index.split(':')[1];
	},
};

module.exports = createModel('Comment', FIELDS, METHODS, ['user', 'comments']);
