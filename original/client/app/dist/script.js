
//####  ./app/scripts/app.js
//"use strict"

var bountyMongo = angular.module('bountyMongo', ['ui.bootstrap']);

//bountyMongo.config( function ($locationProvider) {
//  $locationProvider.html5Mode(true);
//})

bountyMongo.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode(true);
}])


//####  ./app/scripts/controllers/MainCtrl.js
bountyMongo.controller('MainCtrl', [

  '$scope',
  '$location',

  function ($scope, $location) {
    $scope.$on('recordsRefresh', function (event, response) {
//      $scope.records = $location.path();
//      $scope.records = response;
    })
    console.log('url',$location.url())
  }])

//####  ./app/scripts/controllers/QueryCtrl.js
bountyMongo.controller('QueryCtrl', [

  '$scope',
  '$modal',
  'records',

  function ($scope,$modal, records) {
    $scope.pageSizeOptions = [5, 10, 20, 50, 100, 200];
    $scope.pageSize = $scope.pageSizeOptions[2];

    $scope.$watch('pageSize', function (newVal) {
      records.queryOptions('l', newVal);
      records.queryOptions('p', 1)
      records.recordsRefresh();
    })

    $scope.openModal = function(){
      var modalInstance = $modal.open({
        templateUrl: 'addDocumentModal.html'
      });

//      modalInstance.result.then(function (selectedItem) {
//        $scope.selected = selectedItem;
//      }, function () {
//        $log.info('Modal dismissed at: ' + new Date());
//      });
    }
  }])

//####  ./app/scripts/controllers/SidebarCtrl.js
bountyMongo.controller('SidebarCtrl', [

  '$scope',
  'records',
  'server',
  'database',

  function ($scope, records, server, database) {

    server().list().then(function (response) {
      $scope.serverList = _.map(response, function (value, key) {
//        return {name: key, dbName: value}
        return key;
      });
      $scope.server = $scope.serverList[0];
//      console.log($scope.serverList)
    })

    $scope.$watch('server', function (newVal) {
      if (newVal !== undefined) {
//        console.log(newVal)
        database(newVal).list().then(function (response) {
          if (_.isArray(response)) {
            $scope.databaseList = response;
          }
          else{
            $scope.databaseList = [{
              name:response.db
            }]
          }
        }, function (response) {
          console.log('failed request!!!', response)
          $scope.databaseList = null;
        });
      }
    })


//    $scope.$watch('server', function (newVal) {
//      records.server(newVal);
//      records.database('');
//      records.collection('');
//
//
//      server(newVal).query().then(function (response) {
//        $scope.databaseList = response.databases;
//      },function(response){
//        console.log('failed request!!!',response)
//      });
//    });
  }])

//####  ./app/scripts/directives/bmPagination.js
bountyMongo.directive('bmPagination', [

  'bucket',
  'records',

  function (bucket, records) {
    return {
      restrict: 'E',
      scope: {
        currentPage: '='
      },
      templateUrl: '/partials/bmPagination.html',
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

//####  ./app/scripts/directives/bmRecords.js
bountyMongo.directive('bmRecords', ['bucket', 'collection', function (bucket, collection) {
  return{
    restrict: 'E',
    scope: {
      records: '='
    },
    templateUrl: '/partials/bmRecords.html',
    link: function (scope, element, attrs) {

    }
  }
}]);

//####  ./app/scripts/directives/bmSidebar.js
bountyMongo.directive('bmSidebar', [
  'database',
  'collection',
  'records',
  function (database, collection, records) {
    return {
      restrict: 'A',
      templateUrl: '/partials/bmSidebar.html',
      link: function (scope, element, attrs) {
        scope.toggleDatabase = function () {
          scope.isOpen = !scope.isOpen;
          if (scope.isOpen) {
            records.server(scope.server);
            records.database(scope.database);
            records.collection('');
          }
          console.log('scope.server',scope.server)
          console.log('scope.database',scope.database)
          //scope.server is prototypically inheritance from parent
          collection(scope.server, scope.database.name).list().then(function (response) {
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

//####  ./app/scripts/services/bucket.js
bountyMongo.factory('bucket', ['$parse', function ($parse) {
  //app server url
  var serverURL = '/api/';

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
    paginationConfig: paginationConfig
  };
}])

//####  ./app/scripts/services/collection.js
bountyMongo.factory('collection', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function (serverName, databaseName, collectionName) {
      var queryOptions = arguments[3];
      var serverURL = bucket.serverURL;


      var Resource = {};
      Resource.list = function(){
        var url = serverURL + 'servers/' + serverName + '/databases/' + databaseName + '/collections/';
        return $http.get(url).then(function(response){
          return response.data;
        })
      }
      Resource.query = function () {
        var url = serverURL + 'servers/' + server.host + '/databases/' + database.name + '/collections/' + collection.name + '?';

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

//####  ./app/scripts/services/database.js
bountyMongo.factory('database', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function (serverName,databaseName) {
      var serverURL = bucket.serverURL;
      var Resource = {}
      Resource.list = function(){
        var url = serverURL + 'servers/' + encodeURIComponent(serverName) + '/databases/';
        return $http.get(url).then(function(response){
          return response.data;
        })
      }
//      Resource.query = function () {
//        var url = serverURL + 'servers/' + encodeURIComponent(serverName) + '/databases/' + encodeURIComponent(databaseName);
//        return $http.get(url).then(function (response) {
//          //返回该服务器上的所有collections
//          angular.forEach(response.data.data.collectionNames, function (value, key) {
//            value.name = value.name.substr(value.name.indexOf('.') + 1);
//          })
//          return response.data.data;
//        });
//      }
      return Resource;
    }
  }])


//####  ./app/scripts/services/records.js
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

//####  ./app/scripts/services/server.js
bountyMongo.factory('server', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function (serverName) {
      var serverURL = bucket.serverURL;
      var Resource = {};
      Resource.list = function () {
        var url = serverURL + 'servers/';
        return $http.get(url).then(function (response) {
          return response.data;
        });
      };
      Resource.query = function(){
        var url = serverURL + 'servers/' + serverName
        return $http.get(url).then(function (response) {
          return response.data;
        });
      }
      return Resource;
    };
//    return function (server) {
//      var serverURL = bucket.serverURL;
//
//      var url = serverURL + 'servers/' + server.host;
//
////      待研究
////      var Resource = function (data) {
////        angular.extend(this, data);
////      };
//
//      var Resource = {}
//      Resource.query = function () {
//        return $http.get(url).then(function (response) {
//          //返回该服务器上的所有databases
//          return response.data.data;
//        });
//      }
//      return Resource;
//    }
  }])
