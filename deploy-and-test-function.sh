#!/bin/bash

sls deploy function -f $1 && \
newman run api-tests.postman_collection.json --folder $1.js
