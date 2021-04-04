#include "data.hpp";
#include <eosio/system.hpp>
#include <eosio/transaction.hpp>

using namespace data_header;

using std::string;
using std::map;
using std::vector;

CONTRACT data : contract {

private:

public:
    using contract::contract;
    data(name receiver, name code,  datastream<const char*> ds):contract(receiver, code, ds){}

    ACTION user(User user) {
        require_auth(get_self());

        auto table = Users(get_self(), get_self().value);
        auto exists = table.find(user.id);

        check(user.document.find("\"auth\":") == std::string::npos, "User document has private information");
        check(user.document.find("\"email\":") == std::string::npos, "User document has private information");

        if(exists != table.end()) table.modify(exists, same_payer, [&](auto& row){
            row = user;
        });
        else table.emplace(get_self(), [&](auto& row){
            row = user;
        });
    }

    ACTION post(Content content) {
        require_auth(get_self());

        auto table = Contents(get_self(), get_self().value);
        auto exists = table.find(content.id);

        if(exists != table.end()) table.modify(exists, same_payer, [&](auto& row){
            row = content;
        });
        else table.emplace(get_self(), [&](auto& row){
            row = content;
        });
    }

    ACTION interact(Interaction interaction) {
        require_auth(get_self());

        auto table = Interactions(get_self(), get_self().value);
        auto exists = table.find(interaction.id);

        if(exists != table.end()) table.modify(exists, same_payer, [&](auto& row){
            row = interaction;
        });
        else table.emplace(get_self(), [&](auto& row){
            row = interaction;
        });
    }

    ACTION uninteract(uint64_t id) {
        require_auth(get_self());

        auto table = Interactions(get_self(), get_self().value);
        auto exists = table.find(id);

        if(exists != table.end()) table.erase(exists);
    }

    ACTION portfolio(uint64_t user_id, Portfolio portfolio) {
        require_auth(get_self());

        auto table = Portfolios(get_self(), user_id);
        auto exists = table.find(portfolio.timestamp);

        if(exists != table.end()) table.modify(exists, same_payer, [&](auto& row){
            row = portfolio;
        });
        else table.emplace(get_self(), [&](auto& row){
            row = portfolio;
        });
    }

};
