#!/bin/bash

# Queries
INDEXES=`cat ./INDEXES`
echo $INDEXES

cd /opt/couchbase/bin

function run_query {
    ./cbq --script="$1"
}

for index in $INDEXES; do
   run_query $index
done
