require "sequel"

address = ENV['DB_1_PORT_5432_TCP_ADDR'] || 'localhost'

sleep 1 # Let our db get up

# Always try to create teh db, just in case
`createdb -U postgres -h #{address} qdb`


Sequel.extension :migration

db = Sequel.connect("postgres://postgres@#{address}/qdb")


puts "Migrating db.."
Sequel::Migrator.run(db, "migrations")


# Run forever because fig likes that
sleep 1 while true
