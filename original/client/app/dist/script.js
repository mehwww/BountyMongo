//"use strict"

var bountyMongo = angular.module('bountyMongo', []);



bountyMongo.controller('RecordsCtrl', [

  '$scope',
  'bucket',

  function ($scope, bucket) {
    $scope.records = bucket.records;
    $scope.$watch(
      function () {
        return bucket.records
      },
      function (newVal) {
          $scope.records = newVal;
//          $scope.currentPage = bucket.config.queryOptions.p;
//          $scope.numPages = parseInt($scope.records.count/bucket.config.queryOptions.l,10)+1;
      })
  }])
bountyMongo.controller('SidebarCtrl', [

  '$scope',
  'bucket',
  'server',

  function ($scope, bucket, server) {
    $scope.serverList = bucket.serverList;
    $scope.server = $scope.serverList[0];

    $scope.$watch('server', function (newVal) {
      server(newVal).query().then(function (response) {
        $scope.databaseList = response;
        bucket.queryOptions('server',newVal);
        bucket.queryOptions('database','');
        bucket.queryOptions('collection','');
      });
    });
  }])
/*
 bountyMongo.controller('PaginationController', [
 '$scope',
 '$attrs',
 function ($scope, $attrs) {
 var self = this;

 this.noPrevious = function () {
 return self.page === 1;
 };

 this.noNext = function () {
 return self.page === $scope.totalPages;
 }

 this.isActive = function (page) {
 return self.page === page;
 }

 this.calculateTotalPages = function () {
 var totalPages = self.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
 return Math.max(totalPages || 0, 1);
 };
 }]);
 */

bountyMongo.directive('pagination', ['bucket',function (bucket) {
  return {
    restrict: 'E',
    scope: {
      totalItems: '=',
//      currentPage: '='
    },
    templateUrl: './partials/pagination.html',
//    controller: 'PaginationController',
    replace: true,
    link: function (scope, element, attrs) {

//      scope.$watch('totalItems', function (newValue, oldValue) {
//        console.log(newValue)
//      });
      
      
      var makePage = function(number, text, isActive, isDisabled) {
        return {
          number: number,
          text: text,
          active: isActive,
          disabled: isDisabled
        };
      }


      scope.$watch('numPages', function (value) {
        scope.pages = [];
        for (var i = 1; i <= value; i++) {
          scope.pages.push(i);
        }
        if (scope.currentPage > value) {
          scope.selectPage(value);
        }
      });

      scope.noPrevious = function () {
        return scope.currentPage === 1;
      };
      scope.noNext = function () {
        return scope.currentPage === scope.numPages;
      };
      scope.isActive = function (page) {
        return scope.currentPage === page;
      };

      scope.selectPage = function (page) {
        if (!scope.isActive(page)) {
          scope.currentPage = page;
        }
      };

      scope.selectPrevious = function () {
        if (!scope.noPrevious()) {
          scope.selectPage(scope.currentPage - 1);
        }
      };
      scope.selectNext = function () {
        if (!scope.noNext()) {
          scope.selectPage(scope.currentPage + 1);
        }
      };
    }
  };
}]);
bountyMongo.directive('sidebarDatabase', ['database', 'collection','bucket', function (database, collection,bucket) {
  return {
    restrict: 'A',
    templateUrl: './partials/sidebarDatabase.html',
    link: function (scope, element, attrs) {
      scope.toggleDatabase = function () {
        scope.isOpen = !scope.isOpen;
        if (scope.isOpen) {
          bucket.queryOptions('server', scope.server);
          bucket.queryOptions('database', scope.database);
          bucket.queryOptions('collection','');
        }
        //scope.server is prototypically inheritance from parent
        database(scope.server, scope.database).query().then(function (response) {
          scope.collectionList = response;
        })
      }
      scope.selectCollection = function (coll) {

        console.log(coll)

        bucket.queryOptions('server',scope.server);
        bucket.queryOptions('database', scope.database);
        bucket.queryOptions('collection', coll);
        collection(scope.server, scope.database, coll).query().then(function (response) {
          bucket.records = response;
        })
      }
    }
  }

}])
bountyMongo.factory('bucket', ['$parse', function ($parse) {
  //app server url
  var serverURL = 'http://localhost:3000/';

  var config = {
    itemsPerPage:10
  };
  var serverList = [
    {'host': 'localhost', 'port': '27017'},
    {'host': '127.0.0.1', 'port': '27017'},
    {'host': '192.168.1.100', 'port': '27017'}
  ];

  var queryOptions = {};

  var records = {};


  return {
    serverURL: serverURL,
    serverList:serverList,
    config: config,
    queryOptions: function (key, value) {
      if (key === undefined) return queryOptions;
      if (value === undefined) return queryOptions[key];
      queryOptions[key] = value;
    },
    records: records
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
          var collections = [];
          angular.forEach(response.data.data.collectionNames, function (value, key) {
            value.name = value.name.substr(value.name.indexOf('.') + 1);
            this.push(value);
          }, collections)
          return collections;
        });
      }
      return Resource;
    }
  }])

bountyMongo.factory('records', [function () {

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
          return response.data.data.databases;
        });
      }
      return Resource;
    }
  }])
