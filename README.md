# qdb

## Introduction

This is a simple quote database. I'm not completely sure why it exists.

## Importing quotes

If you have existing quotes, stick em in `./db_migrations/quotes.json` before
starting it for the first time and the migrations will add em in.

## Backup up

An example backup setup:

`cd backup; docker build -t qdbbackup:latest .`

Add a cron job that runs the following:
```
# Note the link name and final arg are important
docker run -e "S3_BUCKET=MY_BUCKET" -e "AWS_ACCESS_KEY_ID=SECRET" -e "AWS_SECRET_ACCESS_KEY=SECRE" -e "BACKUP_BASE=/qdb" --link=angularqdb_db_1:db qdbbackup:latest qdb
# Note that the AWS* environment variables can be omitted if you're running on an ec2 instance with roles
```


