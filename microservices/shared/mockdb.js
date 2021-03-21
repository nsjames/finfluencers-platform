let db = {};

let fail = false;
const failable = (fn = null) => {
    if(fail) throw 'Error!';
    if(typeof fn === 'function') return fn();
    return true;
}

module.exports = {
    setFail(bool){ fail = bool; },
    async upsert(key, data, options = null){
        const clone = JSON.parse(JSON.stringify(data));
        if(options && options.cas && options.cas !== '1111') throw "CAS Mismatch!";
        return failable(() => db[key] = {content:clone, cas:'1111'});
    },
    async insert(key, data){
        const clone = JSON.parse(JSON.stringify(data));
        if(await this.exists(key)) throw 'Insert error key exists';
        return failable(() => db[key] = {content:clone, cas:'1111'});
    },
    async get(key, model = null, get_cas = false){
        if(!get_cas) return failable(() => model ? new model(db[key]) : db[key]);
        return {
            cas:'1111',
            data:model ? new model(db[key]) : db[key]
        }
    },
    async exists(key){ return failable(() => !!db[key]); },
    async remove(key){ return failable(() => delete db[key]); },

    // Currently only works for EQUALS logic.
    async query(string, model = null){
        const base = string.split('WHERE')[1];
        const params = base.split('ORDER BY')[0];
        const ands = params.split('AND').map(x => x.trim().replace(/\'/g, ''));
        let matches = [];

        Object.keys(db).map(key => {
            const doc = db[key].content;
            if(ands.every(q => {
                if(q.indexOf('=') > 0) {
                    const [qk, qv] = q.split('=');
                    if (doc[qk.trim()] && doc[qk.trim()].toString().trim() === qv.toString().trim()) return true;
                }
                else if (q.indexOf('!=') > 0){
                    const [qk, qv] = q.split('!=');
                    if (doc[qk.trim()] && doc[qk.trim()].toString().trim() !== qv.toString().trim()) return true;
                }
                else if (q.indexOf('>') > 0){
                    const [qk, qv] = q.split('>');
                    if (doc[qk.trim()] && doc[qk.trim()].toString().trim() > qv.toString().trim()) return true;
                }
                else if (q.indexOf('<') > 0){
                    const [qk, qv] = q.split('<');
                    if (doc[qk.trim()] && doc[qk.trim()].toString().trim() < qv.toString().trim()) return true;
                }
                else if (q.indexOf('>=') > 0){
                    const [qk, qv] = q.split('>=');
                    if (doc[qk.trim()] && doc[qk.trim()].toString().trim() >= qv.toString().trim()) return true;
                }
                else if (q.indexOf('<=') > 0){
                    const [qk, qv] = q.split('<=');
                    if (doc[qk.trim()] && doc[qk.trim()].toString().trim() <= qv.toString().trim()) return true;
                }
                return false;
            })) matches.push(doc);
        });

        if(base.split('ORDER BY')[1]){
            const orderings = base.split('ORDER BY')[1].split('LIMIT')[0].split(',').map(x => ({field:x.split(' ')[0], order:x.split(' ')[1]}));
            for(let i = 0; i < orderings.length; i++){
                const ordering = orderings[i];
                matches = matches.sort((a,b) => {
                    if(ordering.order === 'DESC') return b[ordering.field] - a[ordering.field];
                    return a[ordering.field] - b[ordering.field];
                });
            }
        }

        if(base.split('LIMIT')[1]){
            matches = matches.slice(0, parseInt(base.split('LIMIT')[1].trim()));
        }

        if(string.toLowerCase().indexOf('count(') > -1) return matches.length;

        return matches.map(x => {
            return model ? new model(x) : x;
        });
    },

    async counter(key, delta, options = {}){
        const content = (db[key] ? db[key] : options.initial || 0) + delta;
        return failable(() => db[key] = {content, cas:'1111'});
    },

    dump(){
        console.log(db);
    }
}
