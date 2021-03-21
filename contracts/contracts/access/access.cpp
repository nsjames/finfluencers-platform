#include "access.hpp";
#include <eosio/crypto.hpp>

using namespace access_header;

using std::string;
using std::map;
using std::vector;

CONTRACT access : contract {

private:


public:
    using contract::contract;
    access(name receiver, name code,  datastream<const char*> ds):contract(receiver, code, ds)
    {}

    ACTION addcode(checksum256 hash){
        require_auth(get_self());

        auto table = AccessCodes(get_self(), get_self().value);
        auto index = table.get_index<"hash"_n>();
        auto item = index.find(hash);
        check(item == index.end(), "Code already exists");

        table.emplace(get_self(), [&](auto& row){
            row = AccessCode{
                .id = table.available_primary_key(),
                .hash = hash
            };
        });
    }

    ACTION usecode(string code){
        auto table = AccessCodes(get_self(), get_self().value);
        auto index = table.get_index<"hash"_n>();
        checksum256 hash = sha256(const_cast<char *>(code.c_str()), code.size());
        auto item = index.find(hash);
        check(item != index.end(), "Code does not exist");
        index.erase(item);
    }


};
