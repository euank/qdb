# Introduction

This is a simple quote database. It's meant to be incredibly simple to use and
deploy.

# Deploying

Clone this repository, install [fig](http://fig.sh) and docker, and then run
"fig up". It should be running on [port 8093](http://localhost:8093) after that.

# Importing quotes

If you have existing quotes, stick em in ./db_migrations/quotes.json before
starting it for the first time and the migrations will add em in.

# Backup up

An example backup setup:

`cd backup; docker build -t qdbbackup:latest .`

Add a cron job that runs the following:
```
# Note the link name and final arg are important
docker run -e "S3_BUCKET=MY_BUCKET" -e "AWS_ACCESS_KEY_ID=SECRET" -e "AWS_SECRET_ACCESS_KEY=SECRE" -e "BACKUP_BASE=/qdb" --link=angularqdb_db_1:db qdbbackup:latest qdb
# Note that the AWS* environment variables can be omitted if you're running on an ec2 instance with roles
```


