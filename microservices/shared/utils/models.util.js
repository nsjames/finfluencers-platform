const Databased = require('../models/Databased.model');


const throwFields = (fields, msg = "") => {
    throw new Error(`Fields are incorrect: ${JSON.stringify(fields, null, 4)} -- ${msg}`);
}

const validateFields = (model, source, ignored = []) => {
    const modelProperties = Object.keys(model);
    if(!Object.keys(source).every(prop => {
        if(ignored.includes(prop)) return true;
        const propIsRight = modelProperties.includes(prop) || prop === 'doc_type' || prop === 'created_at';
        if(!propIsRight) console.error(prop);
        return propIsRight;
    })) {
        console.error(source);
        return throwFields(model, "wrong props");
    }
    if(!modelProperties.every(prop => {
	    if(ignored.includes(prop)) return true;
        const propIsRight = prop === 'doc_type' || prop === 'created_at' || !source.hasOwnProperty(prop) || typeof source[prop] === model[prop] || source[prop] === null || model[prop] === 'any';
        if(!propIsRight) console.error('Model prop error', prop, typeof source[prop], model[prop]);
        return propIsRight;
    })) {
        console.error(source);
        return throwFields(model, "wrong prop types");
    }

    modelProperties.map(prop => {
        if(!source.hasOwnProperty(prop)) source[prop] = null;
    });

    return true;
};

const createModel = (name, schema = {}, methods = {}, ignored = []) => {
    return ({[name] : class extends Databased {
            constructor(json = {}) {
                if(!json) json = {};
                // Make sure schema matches
                validateFields(schema, json, ignored);
                // Allows injecting custom constructor handling
                if(methods.constructor) methods.constructor(json);

                // Initializes Databased extension
                super(name.toLowerCase(), json.hasOwnProperty('created_at') ? json.created_at : null);

                // Adds properties and methods to class
	            ignored.map(prop => this[prop] = json[prop]);
                Object.keys(schema).map(prop => this[prop] = json[prop]);
                Object.keys(methods).map(method => method === 'constructor' ? null : this[method] = methods[method]);

                if(json.hasOwnProperty('created_at')) this.created_at = json.created_at;
                if(json.hasOwnProperty('doc_type')) this.doc_type = json.doc_type;
            }

        }})[name];
}

module.exports = {
    validateFields,
    createModel
}
