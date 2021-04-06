#!/bin/bash

# tmux
# ctrl+b && d
# signature-provider = EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV=KEY:5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

pkill -f nodeos

CMD='nodeos -e -p eosio --plugin eosio::chain_api_plugin  --plugin eosio::http_plugin  --plugin eosio::producer_plugin --delete-all-blocks --verbose-http-errors --access-control-allow-origin=* --http-server-address=0.0.0.0:8888'

gnome-terminal --tab -t "blockchain" -- bash -c "$CMD; bash"

RAND=$(openssl rand -hex 12)
cleos wallet create -n $RAND --to-console
cleos wallet import -n $RAND --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

