FROM ruby:2-onbuild

# Create database
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

CMD ["ruby", "./run_migrations.rb"]
