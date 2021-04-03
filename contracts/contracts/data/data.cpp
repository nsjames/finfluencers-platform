#include "data.hpp";
#include <eosio/crypto.hpp>
#include <eosio/system.hpp>

using namespace data_header;

using std::string;
using std::map;
using std::vector;
using Json = nlohmann::json;

CONTRACT data : contract {

private:

public:
    using contract::contract;
    data(name receiver, name code,  datastream<const char*> ds):contract(receiver, code, ds){}

    ACTION broadcast(string user_id, string doc_type, string data) {

    }

};
