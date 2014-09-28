require 'json'
require 'sequel'
require 'grape'
require 'time'

module Qdb
  address = ENV['DB_1_PORT_5432_TCP_ADDR'] || 'localhost'
  sleep 1 # time for db to come up
  DB = Sequel.connect(adapter: :postgres, host: address, database: "qdb", user: "postgres", password: '')
  class Quote < Sequel::Model(DB[:quotes]); end
  class API < Grape::API
    format :json

    helpers do
    end

    resource :quote do
      # GET /quote?id=1
      desc "Get a quote"
      params do
        requires :id, type: Integer, desc: "Quote id"
      end
      get do
        quote = Quote.where(id: params[:id]).first
        error!("Invalid quote id") unless quote

        {id: quote.id, quote: quote.quote, source: quote.source, date: quote.date.iso8601}
      end

      # POST /quote {quote: "quote", source: "http://google.com"}
      desc "Create a quote"
      params do
        requires :quote, type: String, desc: "The quote body"
        optional :source, type: String, desc: "The quote's source"
      end
      post do
        q = Quote.new(quote: params[:quote], source: params[:source])
        q.save || error!("Unable to save quote")
        {ok: 1, id: q.id}
      end
    end


    resource :quotes do
      # GET /quotes
      desc "List quotes"
      params do
        optional :offset, type: Integer, desc: "Quote id to start after"
        optional :limit, type: Integer, desc: "Total quotes to get, must be less than 200"
        optional :search, type: String, desc: "A regex to search by"
        optional :reverseOffset, type: Boolean, desc: "Go in the opposite offset direction"
      end
      get do
        offset = params[:offset]
        limit = params[:limit] || 50
        limit = 200 if limit > 200

        quotes = Quote.order(:id).reverse.limit(limit)

        if offset
          if params[:reverseOffset]
            quotes = quotes.reverse.where{id > offset}
          else
            quotes = quotes.where{id < offset}
          end
        end

        if params[:search]
          quotes = quotes.where(:quote=>Regexp.new(params[:search]))
        end

        error!("This shouldn't happen #{__LINENO__}") unless quotes

        ret = quotes.map{|quote| {id: quote.id, quote: quote.quote, source: quote.source, date: quote.date.iso8601}}

        params[:reverseOffset] ? ret.reverse : ret
      end
    end

    resource :search do
      # GET /search?search=test&offset=100
      desc "Search quotes"
      params do
        requires :search, type: String, desc: "A regex for the search to perform. Please be nice"
        optional :offset, type: Integer, desc: "Quote id to start after"
      end
      get do
        offset = params[:offset] || 0

        quotes = Quote.where{id < offset}.where(:quote=>Regexp.new(params[:search])).order(:id).desc
        error!("This shouldn't happen #{__LINENO__}") unless quotes

        quotes.map{|quote| {id: quote.id, quote: quote.quote, source: quote.source, date: quote.date.iso8501}}
      end
    end

  end
end
