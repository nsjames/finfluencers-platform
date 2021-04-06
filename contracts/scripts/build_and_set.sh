#!/bin/bash

PUBLIC_KEY=${1:-"EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"}

function build {
  eosio-cpp --abigen --contract=$1 ./contracts/$1/$1.cpp -o ~/contracts/$1.wasm
}

function upload {
  build $1
  cleos create account eosio $1 $PUBLIC_KEY $PUBLIC_KEY
  cleos set contract $1 ~/contracts/ $1.wasm $1.abi -p $1@active
  cleos set account permission $1 active '{"threshold": 1,"keys": [{"key": "'$PUBLIC_KEY'","weight": 1}],"accounts": [{"permission":{"actor":"'$1'","permission":"eosio.code"},"weight":1}]}' owner -p $1@owner
}

upload "data"
upload "access"
upload "indexer"


