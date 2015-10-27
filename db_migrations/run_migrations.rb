require "sequel"

address = ENV['DB_1_PORT_5432_TCP_ADDR'] || 'localhost'

100.times do
  # Always try to create teh db, just in case
  if `createdb -U postgres -h #{address} qdb 2>&1` =~ /already exists/ || $? == 0
    break
  else
    sleep 1 # Let our db get up
  end
end


Sequel.extension :migration

db = Sequel.connect("postgres://postgres@#{address}/qdb")


puts "Migrating db.."
Sequel::Migrator.run(db, "migrations")
