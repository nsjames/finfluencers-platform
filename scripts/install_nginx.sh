#!/bin/bash

sudo apt-get update
sudo apt-get install nginx
sudo ufw allow 'Nginx HTTP'
systemctl status nginx
