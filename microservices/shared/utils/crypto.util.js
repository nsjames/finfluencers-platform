const crypto = require('crypto');

const sha256 = cleartext => {
    return crypto.createHash('sha256').update(cleartext, 'utf8').digest('hex')
};

module.exports = {
    sha256,
    SALT:process.env.SALT || 'Fq<-{{S3M9^F&W&%Q:K_E@S{nCv$P#j,X)WA+62e?K:hq%zB"@Z/Ex$LP{}{p%w%'
}
