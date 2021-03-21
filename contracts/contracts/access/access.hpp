#include <eosio/eosio.hpp>
using namespace eosio;

namespace access_header {
    static const uint64_t       ONE_DAY = 60*60*24;
    static const uint64_t       MAX_ACCESS = 100000;

    TABLE [[eosio::contract("access")]] AccessCode {
            uint64_t id;
            checksum256 hash;

            uint64_t primary_key() const { return id; }
            checksum256 by_hash() const { return hash; }

            EOSLIB_SERIALIZE(AccessCode, (id)(hash))
    };

    typedef eosio::multi_index<"codes"_n, AccessCode,
            indexed_by<"hash"_n, const_mem_fun<AccessCode, checksum256, &AccessCode::by_hash>>
    > AccessCodes;
}
