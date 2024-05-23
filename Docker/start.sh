#!/bin/bash

# Start the Node.js server in the background
nohup node server.js > /dev/null 2>&1 &

# Start the http-server
http-server . -p 8080
