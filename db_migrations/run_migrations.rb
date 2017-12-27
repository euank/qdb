require "sequel"

address = ENV['DATABASE_URL'] || raise('DATABASE_URL must be set')

Sequel.extension :migration
db = Sequel.connect(address)

puts "Migrating db.."
Sequel::Migrator.run(db, "migrations")
