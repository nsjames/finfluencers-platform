module.exports = class Databased {

    constructor(doc_type) {
        this.doc_type = doc_type;
        this.created_at = +new Date();
    }

    rawIndex(...params){
        return `${this.doc_type}:${params.join(':')}`;
    }

}
