const BlockchainService = require('./Blockchain.service');

const ORM = require('../orm');
const Results = require('../models/Results.model');
const Interaction = require('../models/Interaction.model');
const {INTERACTION_TYPE} = require('../models/InteractionType');
const couchbase = require('couchbase');
const UserService = require('../services/User.service');

module.exports = class InteractionService {

    static async addInteraction(id, user, parent_index, parent_owner_id, type, data = null){
	    const interaction = new Interaction({ id, user_id:user.id, parent_index, parent_owner_id, type, data });
	    if(!await BlockchainService.interact(interaction, user)) return false;
	    if(!await ORM.insert(interaction).catch(err => {
	    	console.error("Error inserting interaction");
	    	return false;
	    })) return null;
	    await UserService.deltaInfluence(interaction.data || 1, parent_owner_id);
	    return interaction;
    }

    static async removeInteraction(id, parent_owner_id, user){
	    if(!await BlockchainService.uninteract(id, user)) return false;
	    const interaction = ORM.get((new Interaction({ id })).index(), Interaction);
	    await ORM.remove(interaction.index());
	    await UserService.deltaInfluence(-interaction.data || 1, parent_owner_id);
    }

}
