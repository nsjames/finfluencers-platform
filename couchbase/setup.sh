#!/bin/bash

# Basic install

curl -O https://packages.couchbase.com/releases/couchbase-release/couchbase-release-1.0-amd64.deb
sudo dpkg -i ./couchbase-release-1.0-amd64.deb
sudo apt-get update
sudo apt-get install couchbase-server-community
# apt list -a couchbase-server-community
couchbase-server-community/xenial 6.0.0-1693-1 amd64
sudo apt-get install couchbase-server-community=6.0.0-1693-1


