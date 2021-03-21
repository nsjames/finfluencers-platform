#include "../../libraries/nlohmann/json.hpp"

#include <eosio/eosio.hpp>
using namespace eosio;
using Json = nlohmann::json;

namespace data_header {

    TABLE [[eosio::contract("data")]] Content {
            uint64_t                id;
            eosio::time_point_sec   created_at;
            std::string             data;


            uint64_t primary_key() const { return id; }

            EOSLIB_SERIALIZE(Content, (id)(created_at)(data))
    };

    typedef eosio::multi_index<"content"_n, Content> Contents;





    TABLE [[eosio::contract("data")]] ReverseIndex {
            uint64_t            id;
            uint64_t            value;


            uint64_t primary_key() const { return id; }
            uint64_t by_value() const { return value; }

            std::string to_string() const {
                return "{\"id\":"+std::to_string(id)+",\"value\":"+std::to_string(value)+"}";
            }

            Json to_json() const {
                Json json;
                json["id"] = id;
                json["value"] = value;
                return json;
            }

            EOSLIB_SERIALIZE(ReverseIndex, (id)(value))
    };

    typedef eosio::multi_index<"reverseindex"_n, ReverseIndex,
            indexed_by<"value"_n, const_mem_fun<ReverseIndex, uint64_t, &ReverseIndex::by_value>>
    > ReverseIndices;
}
