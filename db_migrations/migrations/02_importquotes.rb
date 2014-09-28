require 'json'
Sequel.migration do
  up do
    begin
      File.open("quotes.json", "r:UTF-8") do |f|
        data = JSON.parse(f.read)
        self[:quotes].import([:quote, :date], data["quotes"].map{|q| [q["text"], DateTime.parse(q["date"])]})
      end
    end rescue true
  end
  down do
    # no down ;_;
  end
end
