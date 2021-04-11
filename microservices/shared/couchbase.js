const couchbase = require('couchbase');

let BUCKET_NAME = null;
let cluster = null;
let instance;
let manual_instance;

let initialized = false;
const init = (host, username, password, bucket_name) => {
    if(initialized) return true;
    initialized = true;
    BUCKET_NAME = bucket_name;
    cluster = new couchbase.Cluster(host, {
        username: username,
        password: password,
    })
}

const query = (queryString, model = null) => {
    // Replaces placeholder param.
    queryString = queryString.replace(/BUCKET_NAME/g, '`'+BUCKET_NAME+'`');

    const isCount = queryString.indexOf('COUNT(') > -1;

    // console.log(queryString);
    return (manual_instance ? manual_instance : cluster).query(queryString, {
        scanConsistency: couchbase.QueryScanConsistency.RequestPlus
    }).then(({meta, rows}) => {
        if(!rows) return [];
        // Fix for couchbase stupidness
        rows = rows.map(x => x[BUCKET_NAME] ? x[BUCKET_NAME] : x);
        rows = rows.map(x => isCount ? x['$1'] : x);

        if(isCount) return rows[0];

        return rows.map(x => {
            if(model) return new model(x);
            return x;
        })
    }).catch(err => {
        console.error('Couchbase query error', err);
        return null
    });
}

const get = () => {
    if(manual_instance) return manual_instance;
    if(instance) return instance;

    init();

    instance = cluster.bucket(BUCKET_NAME).defaultCollection();
    return instance;
};

const set = _db => {
    manual_instance = _db;
};

const flush = () => {
    console.warn("Flushing couchbase bucket", BUCKET_NAME);
    cluster.buckets().flushBucket(BUCKET_NAME);
};

const isAlive = async () => {
    const ping = await cluster.bucket(BUCKET_NAME).ping();
    return Object.keys(ping.services).every(k => ping.services[k].every(x => x.status === 'ok'))
};

const rawBucket = () => {
    return cluster.bucket(BUCKET_NAME);
}

module.exports = {
    init,
    get,
    query,
    set,
    flush,
    isAlive,
    couchbase,
	rawBucket,
}

