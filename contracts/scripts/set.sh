#!/bin/bash

CONTRACT=$1
ACCOUNT=${2-$CONTRACT}

eosio-cpp --abigen --contract=$CONTRACT ./contracts/$CONTRACT/$CONTRACT.cpp -o ~/finfluencers/contracts/build/$CONTRACT.wasm
#sed -i 's/1.1/1.0/g' ~/contracts/idnetwork.abi
#cleos set contract $ACCOUNT ~/finfluencers/contracts/build/ $CONTRACT.wasm $CONTRACT.abi -p $ACCOUNT@active
