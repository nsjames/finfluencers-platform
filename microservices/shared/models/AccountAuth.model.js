const {createModel} = require('../utils/models.util');
const {sha256} = require('../utils/crypto.util')

const FIELDS = {
    type:'number',
    data:'any'
};

const METHODS = {
    isValid(){
        if(this.type === null || this.data === null) return false;
        return this.type >= 0 && this.type <= 1
            && this.data.toString().length > 0
    },
    safe(){
        return {
            type:this.type,
        }
    }
};

module.exports = createModel('AccountAuth', FIELDS, METHODS);


// AUTH_TYPES:{
//     OAUTH:0,
//         PASSWORD:1
// },
// AccountAuth:createModel('AccountAuth', {
//     type:'number',
//     data:'any'
// }, {
//     isValid(){
//         if(this.type === null || this.data === null) return false;
//         return this.type >= 0 && this.type <= 1
//             && this.data.toString().length > 0
//     }
// })
