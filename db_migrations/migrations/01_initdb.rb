Sequel.migration do
  change do
    create_table(:quotes) do
      primary_key :id
      String :quote, null: false
      String :source

      String :ip

      Timestamp :date, {null: false, default: Sequel::SQL::Function.new(:now)}
    end
  end
end
