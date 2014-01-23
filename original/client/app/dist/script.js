//"use strict"

var bountyMongo = angular.module('bountyMongo', []);



bountyMongo.controller('MainCtrl', [

  '$scope',

  function ($scope) {
    $scope.$on('recordsRefresh',function(event,response){
      $scope.records = response;
    })
  }])
bountyMongo.controller('QueryCtrl', [

  '$scope',
  'records',

  function ($scope, records) {
    $scope.pageSizeOptions = [5, 10, 20, 50, 100, 200];
    $scope.pageSize = $scope.pageSizeOptions[2];

    $scope.$watch('pageSize', function (newVal) {
      records.queryOptions('l', newVal);
      records.queryOptions('p', 1)
      records.recordsRefresh();
    })
  }])
bountyMongo.controller('SidebarCtrl', [

  '$scope',
  'records',
  'server',
  'bucket',

  function ($scope, records, server,bucket) {
    $scope.serverList = bucket.serverList;
    $scope.server = $scope.serverList[0];

    $scope.$watch('server', function (newVal) {
      records.server(newVal);
      records.database('');
      records.collection('');


      server(newVal).query().then(function (response) {
        $scope.databaseList = response.databases;
      },function(response){
        console.log('failed request!!!',response)
      });
    });
  }])
bountyMongo.directive('pagination', [

  'bucket',
  'records',

  function (bucket, records) {
    return {
      restrict: 'E',
      scope: {
        currentPage: '='
      },
      templateUrl: './partials/pagination.html',
      replace: true,
      link: function (scope, element, attrs) {

        var isActive = function (page) {
          return scope.currentPage === page;
        };

        var calculateTotalPages = function (totalItems, itemsPerPage) {
          var totalPages = itemsPerPage < 1 ? 1 : Math.ceil(totalItems / itemsPerPage);
          return Math.max(totalPages || 0, 1);
        };

        var makePage = function (number, text, isActive, isDisabled) {
          return {
            number: number,
            text: text,
            active: isActive,
            disabled: isDisabled
          };
        }

        var getPages = function (currentPage, totalPages) {
          if (!totalPages || totalPages === 1)return;
          var pages = [];
          var maxsize = bucket.paginationConfig.maxsize;
          var half = Math.ceil(maxsize / 2)
          var min = (currentPage > half) ? Math.max(currentPage - (half - 3), 1) : 1;
          var max = (totalPages - currentPage > half) ? Math.min(currentPage + (half - 3), totalPages) : totalPages;//21
          var start = (max === totalPages) ? Math.max(totalPages - (maxsize - 3), 1) : min;
          var end = (min === 1) ? Math.min(start + (maxsize - 3), totalPages) : max;

          for (var i = start; i <= end; i++) {
            var page = makePage(i, i, isActive(i), false);
            pages.push(page);
          }
          if (start > 3) {
            var page = makePage(0, '...', false, true);
            pages.unshift(page);
            page = makePage(1, 1, isActive(1), false);
            pages.unshift(page);
          }
          if (end < totalPages - 2) {
            var page = makePage(0, '...', false, true);
            pages.push(page);
            page = makePage(totalPages, totalPages, isActive(totalPages), false);
            pages.push(page);
          }
          //add 'Previous' and 'Next'
          pages.unshift(makePage(currentPage - 1, 'Previous', false, scope.currentPage === 1))
          pages.push(makePage(currentPage + 1, 'Next', false, scope.currentPage === scope.totalPages))

          return pages;
        }

        scope.selectPage = function (page) {
          if (!isActive(page) && page > 0 && page <= scope.totalPages) {
            scope.currentPage = page;
            scope.pages = getPages(scope.currentPage, scope.totalPages);
            records.queryOptions('p', page);
            records.recordsRefresh();
          }
        }

        scope.$watch('currentPage', function () {
          scope.pages = getPages(scope.currentPage, scope.totalPages);
        });

        scope.$on('recordsRefresh', function (event, response) {
          var totalItems = response.count;
          var itemsPerPage = records.queryOptions('l');
          scope.currentPage = records.queryOptions('p');
          scope.totalPages = calculateTotalPages(totalItems, itemsPerPage);
          scope.pages = getPages(scope.currentPage, scope.totalPages);
          console.log(scope.pages)
        });
      }
    };
  }]);
bountyMongo.directive('records', ['bucket', 'collection', function (bucket, collection) {
  return{
    restrict: 'E',
    scope: {
      records: '='
    },
    templateUrl: './partials/records.html',
    link: function (scope, element, attrs) {

    }
  }
}]);
bountyMongo.directive('sidebarDatabase', [
  'database',
  'collection',
  'records',
  function (database, collection, records) {
    return {
      restrict: 'A',
      templateUrl: './partials/sidebarDatabase.html',
      link: function (scope, element, attrs) {
        scope.toggleDatabase = function () {
          scope.isOpen = !scope.isOpen;
          if (scope.isOpen) {
            records.server(scope.server);
            records.database(scope.database);
            records.collection('');
          }
          //scope.server is prototypically inheritance from parent
          database(scope.server, scope.database).query().then(function (response) {
            scope.collectionList = response.collectionNames;
          })
        }
        scope.selectCollection = function (coll) {
          records.server(scope.server);
          records.database(scope.database);
          records.collection(coll);
          records.queryOptions('p',1);
          records.recordsRefresh();
        }
      }
    }

  }])
bountyMongo.factory('bucket', ['$parse', function ($parse) {
  //app server url
  var serverURL = 'http://localhost:3000/';

  var paginationConfig = {
    maxsize:9
  };

  var serverList = [
    {'host': 'localhost', 'port': '27017'},
    {'host': '127.0.0.1', 'port': '27017'},
    {'host': '192.168.1.100', 'port': '27017'}
  ];

  return {
    serverURL: serverURL,
    serverList:serverList,
    paginationConfig: paginationConfig,
  };
}])
bountyMongo.factory('collection', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function (server, database, collection) {
      var queryOptions = arguments[3];
      var serverURL = bucket.serverURL;

      var url = serverURL + 'servers/' + server.host + '/databases/' + database.name + '/collections/' + collection.name + '?';

      var Resource = {};
      Resource.query = function () {
        if (queryOptions) {
          if (queryOptions.q)url = url + 'q=' + JSON.stringify(queryOptions.q) + '&';
          if (queryOptions.p)url = url + 'p=' + queryOptions.p + '&';
          if (queryOptions.l)url = url + 'l=' + queryOptions.l;
        }

        return $http.get(url).then(function (response) {
          if (response.data.status === 'error') {
            return response.data.error
          }
          return response.data.data;
        });
      }
      return Resource;
    }
  }])
bountyMongo.factory('database', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function (server,database) {
      var serverURL = bucket.serverURL;
      var url = serverURL + 'servers/' + server.host + '/databases/' + database.name;
      var Resource = {}
      Resource.query = function () {
        return $http.get(url).then(function (response) {
          //返回该服务器上的所有collections
          angular.forEach(response.data.data.collectionNames, function (value, key) {
            value.name = value.name.substr(value.name.indexOf('.') + 1);
          })
          return response.data.data;
        });
      }
      return Resource;
    }
  }])

bountyMongo.factory('records', [
  '$rootScope',
  'server',
  'database',
  'collection',
  function ($rootScope, server, database, collection) {
    var recordsService = {};

    var server;
    var database;
    var coll;

    var queryOptions = {};

    recordsService.server = function (value) {
      if (value === undefined) return server;
      server = value;
    }
    recordsService.database = function (value) {
      if (value === undefined) return database;
      database = value;
    }
    recordsService.collection = function (value) {
      if (value === undefined) return coll;
      coll = value;
    }
    recordsService.queryOptions = function (key, value) {
      if (key === undefined) return queryOptions;
      if (value === undefined) return queryOptions[key];
      queryOptions[key] = value;
    }

    recordsService.recordsRefresh = function () {
      if (!server)return console.log('need set server');
      if (!database)return console.log('need set database');
      if (!coll)return console.log('need set collection');
      collection(server, database, coll, queryOptions).query().then(function (response) {
        $rootScope.$broadcast('recordsRefresh', response)
      })
    }

    return recordsService;
  }])
bountyMongo.factory('server', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function (server) {
      var serverURL = bucket.serverURL;

      var url = serverURL + 'servers/' + server.host;

//      待研究
//      var Resource = function (data) {
//        angular.extend(this, data);
//      };

      var Resource = {}
      Resource.query = function () {
        return $http.get(url).then(function (response) {
          //返回该服务器上的所有databases
          return response.data.data;
        });
      }
      return Resource;
    }
  }])
