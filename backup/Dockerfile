FROM postgres

RUN apt-get update && apt-get update && apt-get install ca-certificates && rm -rf /var/lib/apt/lists/*


# Remember to link in our target as "db"
# The command is of the format: database name, additional pg_dump options

COPY ./gof3r /bin/
RUN chmod +x /bin/gof3r

COPY ./backup /backup

RUN chmod +x /backup

ENTRYPOINT /backup
