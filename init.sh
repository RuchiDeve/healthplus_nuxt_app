#!/usr/bin/env bash
set -e

(cd /app && 
git fetch --all &&
git reset --hard origin/master &&
# git pull https://dennisohere:UVDXZcyzBpabuAYPmtB7@bitbucket.org/dennisohere/healthplus_nuxt_app.git &&
 cp ./.env.prod ./.env &&
 npm install &&
 npm run build &&
 npm run start)