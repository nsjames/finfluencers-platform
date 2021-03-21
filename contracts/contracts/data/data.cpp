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

template<class UnaryFunction>
void recursive_iterate(const Json& j, UnaryFunction f, string last_key = "") {
    for(auto it = j.begin(); it != j.end(); ++it) {
        string nextKey = last_key == "" ? it.key() : last_key + "." + it.key();
        if (it->is_object()) recursive_iterate(*it, f, nextKey);
        else if (it->is_array()) {
            uint64_t pos = 0;
            for(auto it_it = it->begin(); it_it != it->end(); ++it_it){
                if(it_it->is_object() || it_it->is_array()) recursive_iterate(*it_it, f, nextKey + "." + std::to_string(pos));
                else f(it_it, nextKey + "." + std::to_string(pos));
                pos++;
            }
        }
        else f(it, nextKey);
    }
}

public:
    using contract::contract;
    data(name receiver, name code,  datastream<const char*> ds):contract(receiver, code, ds){}

    ACTION broadcast(string data) {
        Json json = Json::parse(data);

        auto contents = Contents(get_self(), get_self().value);
        Content content{
            .id = contents.available_primary_key(),
            .created_at = time_point_sec(current_block_time().to_time_point().sec_since_epoch()),
            .data = data
        };
        contents.emplace(get_self(), [&](auto& row){ row = content; });

        recursive_iterate(json, [&](Json::const_iterator it, string key){
            uint64_t hashkey = std::hash<string>{}(key);
            print(key + "=");
            print(std::to_string(hashkey) + "|");
            auto table = ReverseIndices(get_self(), hashkey);

            if(it.value().is_null()) return;

            uint64_t value;
            if(it.value().is_boolean()) value = (uint64_t)((bool)it.value() ? 1 : 0);
            if(it.value().is_number()) value = (uint64_t)it.value();
            if(it.value().is_string()) value = std::hash<string>{}(it.value());
            table.emplace(get_self(), [&](auto& row){
                row.id = content.id;
                row.value = value;
            });
        });
    }

    ACTION find(string key, uint64_t value, uint64_t limit, uint64_t offset){
        uint64_t hashkey = std::hash<string>{}(key);
        auto table = ReverseIndices(get_self(), hashkey);
        auto index = table.get_index<"value"_n>();
        auto sorted = index.lower_bound(value);
        Json json = Json::array();
        for(auto i = offset; i < limit; i++){
            auto item = std::next(sorted, i);
            if(item == index.end()) break;
            json.push_back(item->to_json());
        }
        check(false, Json(json.dump()).dump());
    }


};
