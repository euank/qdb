# Introduction

This is a simple quote database. It's meant to be incredibly simple to use and
deploy.

# Deploying

Clone this repository, install [fig](http://fig.sh) and docker, and then run
"fig up". It should be running on [port 8093](http://localhost:8093) after that.

# Importing quotes

If you have existing quotes, stick em in ./db_migrations/quotes.json before
starting it for the first time and the migrations will add em in.
