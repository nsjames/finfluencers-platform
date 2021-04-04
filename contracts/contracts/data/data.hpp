#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/crypto.hpp>
using namespace eosio;

namespace data_header {

    TABLE [[eosio::contract("data")]] User {
            uint64_t                id;
            public_key              key;
            std::string             document;


            uint64_t primary_key() const { return id; }

            EOSLIB_SERIALIZE(User, (id)(key)(document))
    };

    typedef eosio::multi_index<"users"_n, User> Users;

    TABLE [[eosio::contract("data")]] Content {
            uint64_t                id;
            uint64_t                user_id;
            std::string             document;


            uint64_t primary_key() const { return id; }
            uint64_t by_user() const { return user_id; }

            EOSLIB_SERIALIZE(Content, (id)(user_id)(document))
    };

    typedef eosio::multi_index<"contents"_n, Content,
            indexed_by<"user"_n, const_mem_fun<Content, uint64_t, &Content::by_user>>
    > Contents;

    TABLE [[eosio::contract("data")]] Interaction {
            uint64_t                id;
            uint64_t                user_id;
            std::string             document;


            uint64_t primary_key() const { return id; }
            uint64_t by_user() const { return user_id; }

            EOSLIB_SERIALIZE(Interaction, (id)(user_id)(document))
    };

    typedef eosio::multi_index<"interactions"_n, Interaction,
            indexed_by<"user"_n, const_mem_fun<Interaction, uint64_t, &Interaction::by_user>>
    > Interactions;

    struct Asset {
        std::string     id;
        std::string     amount;
    };

    TABLE [[eosio::contract("data")]] Portfolio {
            uint64_t                timestamp;
            uint64_t                content_id;
            std::vector<Asset>      assets;


            uint64_t primary_key() const { return timestamp; }
            uint64_t by_content_id() const { return content_id; }

            EOSLIB_SERIALIZE(Portfolio, (timestamp)(content_id)(assets))
    };

    typedef eosio::multi_index<"portfolios"_n, Portfolio,
            indexed_by<"content"_n, const_mem_fun<Portfolio, uint64_t, &Portfolio::by_content_id>>
    > Portfolios;

    // TODO: Comments


}
