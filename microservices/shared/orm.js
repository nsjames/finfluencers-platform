const couchbase = require('./couchbase');
let bucket = null;

const set = _db => {
    couchbase.set(_db);
    bucket = couchbase.get();
}

if(process.env.UNIT_TESTING){
    console.log('Loaded ORM with mock database');
    set(require('./mockdb'));
}

const init = (host, username, password, bucket_name) => {
    if(!host){
        host = process.env.COUCHBASE_HOST;
        username = process.env.COUCHBASE_USERNAME;
        password = process.env.COUCHBASE_PASSWORD;
        bucket_name = process.env.BUCKET_NAME;
    }
    if(!host) throw new Error("You must provide couchbase with a host, check your .env settings");

    couchbase.init(host, username, password, bucket_name);
    bucket = couchbase.get();
}

const checkBucket = () => {
	if(!bucket) init();
	// if(!bucket) throw new Error("ORM is not initialized");
}

const insert = async (model, index = null) => {
    checkBucket();
    return bucket.insert(index ? index : model.index(), model);
};

const upsert = async (model, index = null) => {
    checkBucket();
    return bucket.upsert(index ? index : model.index(), model);
};

const remove = async index => {
    checkBucket();
    return bucket.remove(index);
};

const get = async (index, model = null) => {
    checkBucket();
    return bucket.get(index).then(x => {
        if(!x) return null;
        return model ? new model(x.content) : x.content;
    });
};

const exists = async index => {
	checkBucket();
	return bucket.exists(index).then(x => {
		return x.exists;
	});
};

const atomicUpsert = async (index, updater = () => {}) => {
	checkBucket();
	const doc = await bucket.get(index).catch(err => null);
	if(!doc) return false;

	const updated = updater(doc.content);
	if(!updated) return false;

	return bucket.replace(index, updated, {
	    cas:doc.cas
    }).then(() => true).catch(err => {
        console.error("Atomic upsert error", err, doc.cas);
        return false;
    });
}

const atomicUpsertOrInsert = async (index, updater = () => {}, model) => {
	checkBucket();
	// TODO: Fix, might overwrite if network error on catch
	if(!await exists(index).catch(err => {
	    console.error("Couchbase exists error", err);
	    return false;
    })){
	    return upsert(model, index);
    }

    return atomicUpsert(index, updater);
}

const getBucket = () => {
    checkBucket();
    return bucket;
};

const rawBucket = () => {
    checkBucket();
    return couchbase.rawBucket();
};

const query = async (...params) => {
    checkBucket();
    if(bucket.query) return bucket.query(...params);
    return couchbase.query(...params);
};

const dump = () => {
    bucket.dump();
};

module.exports = {
    init,
    insert,
    upsert,
    remove,
    get,
    exists,
    query,
    getBucket,
	atomicUpsert,
    atomicUpsertOrInsert,
	rawBucket,

    dump,
    set
}
