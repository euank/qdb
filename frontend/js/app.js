var app = angular.module('Qdb', ['ngRoute', 'angular-flash-pure', 'ngResource', 'ngSanitize']);

app.factory("simpleFlash", ["flash", "$rootScope", function(flash, $rootScope) {
  var retObj = {};
  ['error', 'notice', 'warning', 'success'].forEach(function(x){
    retObj[x] = function(text) {
      flash[x].setMessage(text);
      $rootScope.$emit('event:angularFlash');
    };
  });
  return retObj;
}]);


app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/quotes', {
      templateUrl: 'partials/quotes.html',
      controller: 'MainCtrl',
      reloadOnSearch: false
    })
    .when('/quote/:quoteId', {
      templateUrl: 'partials/quote.html',
      controller: 'SingleCtrl'
    })
    .when('/new', {
      templateUrl: 'partials/new.html',
      controller: 'NewCtrl'
    })
    .when('/search', {
      templateUrl: 'partials/search.html',
      controller: 'SearchCtrl'
    })
    .otherwise({
      redirectTo: '/quotes'
    });
}]);


app.controller("NewCtrl", ["$scope", "$http", "$resource", 'simpleFlash', '$filter', function($scope, $http, $resource, flash, $filter) {

  $scope.quote = '';
  $scope.source = '';
  $scope.queryActive = false;

  var Quote = $resource('/api/quote');

  $scope.addQuote = function() {
    if($scope.quote.trim() === '') {
      flash.error("Please don't submit empty quotes, dawg");
      return false;
    }

    var quote = new Quote({quote: $scope.quote});

    if($scope.source.trim().length > 0) quote.source = $scope.source.trim();

    $scope.queryActive = true;
    quote.$save().then(function() {
      $scope.queryActive = false;
      flash.notice("Quote added!");

      $scope.quote = '';
      $scope.source = '';
    }, function(err) {
      $scope.queryActive = false;
      flash.error("Error happened, rip quote");
      console.log(err);
    });
  };
}]);

app.controller("MainCtrl", ['$scope', '$http', '$resource', '$filter', '$routeParams', '$location', 'simpleFlash', '$window',
                    function($scope,   $http,   $resource,   $filter,   $routeParams,   $location,   flash,   $window) {

  $scope.quoteInput = '';


  $scope.dat = {};
  $scope.dat.search = '';
  $scope.dat.offset = null;
  $scope.dat.quotes = [];

  $scope.quotes = $scope.dat.quotes;

  var s = $location.search();
  if(s.search) $scope.dat.search = s.search;
  if(s.offset) $scope.dat.offset = s.offset;

  var initialize = function() {
    $scope.quotes = [];
    $scope.first_page = $scope.dat.offset === null;
    $scope.last_page = false;
    $scope.query_in_progress = false;

    initQuotes();
  };


  $scope.$watch('dat.search', function(newVal, oldVal) {
    // Eventually we might allow more dynamic searching e.g. by a floating box at the top. Todo
    // making that a filter would make more sense

    if(typeof newVal == "undefined") return;
    if(newVal === oldVal) return;
    // invalidate everything because we have a search term now
    $scope.dat.offset = null;
    initialize();
  });

  $scope.$watch('quotes', function(quotes) {
    if(quotes && quotes.length && quotes.length > 0) {
      $location.search("offset", quotes[0].id + 1);
    }
  }, true);



  var Quotes = $resource("/api/quotes");

  var initQuotes = function() {
    $scope.query_in_progress = true;

    var quos = Quotes.query({offset: $scope.dat.offset, search: $scope.dat.search}, function() {
      $scope.query_in_progress = false;

      $scope.quotes = quos;
      if($scope.quotes.length < 50) {
        $scope.last_page = true;
      }
    }, function(err) {
      flash.error("Couldn't get dem quotes" + err);
    } );
  };

  initialize();


  $scope.scrollUp = function() {
    $window.document.querySelector("#quotes_header").scrollIntoView(true);
  };

  $scope.prev = function(scroll) {
    if(scroll) $scope.scrollUp();

    $scope.last_page = false;
    var first_id = $scope.quotes[0].id;

    $scope.query_in_progress = true;
    var q = Quotes.query({limit: 51, offset: first_id, reverseOffset: true, search: $scope.dat.search}, function() {
      $scope.query_in_progress = false;

      $scope.first_page = false;

      if(q.length < 51) $scope.first_page = true;

      if(q.length == 51) q.shift();

      if(q.length <= 1) {
        return;
      }

      $scope.last_page = false;
      $scope.quotes = q;
    }, function(err) {
      flash.error("Something went wrong: " + err);
    });
  };
  $scope.next = function(scroll) {
    if(scroll) $scope.scrollUp();

    var last_id = $scope.quotes[$scope.quotes.length-1].id;
    $scope.query_in_progress = true;

    var nextQuotes = Quotes.query({limit: 51, offset: last_id, search: $scope.dat.search}, function() {
      $scope.query_in_progress = false;

      $scope.last_page = false;

      if(nextQuotes.length < 51) $scope.last_page = true;

      if(nextQuotes.length == 51) nextQuotes.pop();

      if(nextQuotes.length === 0) {
        return;
      }

      // Can't be on the first page if you got through a next :D
      $scope.first_page = false;

      $scope.quotes = nextQuotes;
    });
  };
}]);

app.controller("SingleCtrl", ['simpleFlash', '$window', '$scope', '$resource', '$filter', "$routeParams", function(flash, $window, $scope, $resource, $filter, $routeParams) {

  $scope.isLink = false;

  var Quote = $resource("/api/quote");
  $scope.quote = $resource("/api/quote").get({id: $routeParams.quoteId}, function() {
    var quote = $scope.quote;

    var parser = $window.URI.parse(quote.source);
    if(parser.protocol && parser.hostname) {
      $scope.isLink = true;
    }

  }, function(err) {
    flash.error("Invalid quote: " + err);
  });

}]);

app.controller("SearchCtrl", ['$scope', '$location', function($scope, $location) {
  $scope.term = '';

  $scope.Search = function() {
    $location.path("/quotes").search({search: $scope.term});
  };
}]);
