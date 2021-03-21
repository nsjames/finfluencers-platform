module.exports = class Databased {

    constructor(docType) {
        this.docType = docType;
    }

    rawIndex(...params){
        return `${this.docType}:${params.join(':')}`;
    }

}
