#!/bin/bash
node generateUserID.js
k6 run -c "./config.json" searchV2.js 