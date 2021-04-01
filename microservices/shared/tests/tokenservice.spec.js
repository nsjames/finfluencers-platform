const { assert } = require('../../../utilities/assert');

const TokenService = require('../services/Token.service');

describe('Token Service', () => {


    it('should be able to search for a token', async () => {
	    const found = await TokenService.search('BTC');
	    console.log('found', found);
    });


});
