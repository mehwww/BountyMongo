//"use strict"

var bountyMongo = angular.module('bountyMongo', []);



bountyMongo.controller('RecordsCtrl', [

  '$scope',
  'bucket',

  function ($scope, bucket) {
//    $scope.bucket = bucket;
    $scope.records = bucket.records;
    $scope.$watch(
      function () {
        return bucket.records
      },
      function (newVal) {
          $scope.records = newVal;
          $scope.currentPage = bucket.config.queryOptions.p;
          $scope.numPages = parseInt($scope.records.count/bucket.config.queryOptions.l,10)+1;
      })


  }])
bountyMongo.controller('SidebarCtrl', [

  '$scope',
  '$q',
  'bucket',
  'server',
  'database',
  'collection',

  function ($scope, $q, bucket, server, database, collection) {
    $scope.serversList = bucket.config.server.list;
    $scope.selectedServer = $scope.serversList[0];

    $scope.$watch('selectedServer', function () {
      bucket.config.server.selectServer($scope.selectedServer);
      server().query().then(function (response) {
        $scope.databasesList = response;
        $scope.databaseList = response;
        $scope.selectedDatabase = null;
        $scope.selectedCollection = null;
        $scope.collections = [];
      });
    });

    $scope.$watch('selectedDatabase', function () {
      bucket.config.database.selectDatabase($scope.selectedDatabase);
      if (!$scope.selectedDatabase) return;
      database().query().then(function (response) {
        $scope.collections = response;
        $scope.collectionsList = response;
      })
    });

    $scope.$watch('selectedCollection', function () {
      bucket.config.collection.selectCollection($scope.selectedCollection);
      if (!$scope.selectedCollection) return;
      collection().query().then(function (response) {
        $scope.documents = response;
      })
    })

//        $scope.ngCity = 'asdf';

//    $scope.$watch('selectedDatabase', function (newValue, oldValue) {
//        if (!newValue) return;
//        databasesResource($scope.selectedServer.host, $scope.selectedDatabase.name).query().then(function (res) {
//            $scope.collectionsList = res.data.collectionNames
//            $scope.database = res;
//        });
//    });


//    databasesResource();
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

bountyMongo.directive('pagination', function () {
  return {
    restrict: 'E',
    scope: {
      totalItems: '=count',
      currentPage: '='
    },
    templateUrl: './partials/pagination.html',
//    controller: 'PaginationController',
    replace: true,
    link: function (scope, element, attrs) {

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
});
bountyMongo.directive('collection', [function () {
  return {
    restrict:'E',
    scope:{
    },
    templateUrl:'./partials/collection.html',
    replace:true,
    controller:['$scope',function($scope){

    }]
  }

}])
bountyMongo.directive('sidebarDatabase', ['database','collection', function (database,collection) {
  return {
    restrict: 'A',
//    scope:true,
    templateUrl: './partials/sidebarDatabase.html',
//    replace:true,
//    controller:['$scope',function(){
//      var self = this;
//      this.collections = [];
//      this.closeOthers = function(selectedCollection){
//        angular.forEach(self.collections,function(collection){
//          if(collection !== selectedCollection){
//            collection.isSelected = false;
//          }
//        });
//      };
//      this.addCollection = function(collectionScope){
//        self.collections.push(collectionScope);
//        collectionScope.$on('$destroy',function(){
//          self.removeCollection(collectionScope)
//        })
//      }
//      this.removeCollection = function(collection){
//        var index = self.collections.indexOf(collection);
//        if(index !== -1){
//          this.collections.splice(index, 1);
//        }
//      }
//    }],
    link: function (scope, element, attrs) {
      scope.toggle = function(){
        scope.isOpen = !scope.isOpen;
        console.log(scope.selectedServer)
//        database().query().then(function (response) {
//          scope.collectionList = response;
//        })
      }
    }
  }

}])
bountyMongo.factory('bucket', [function () {
  //app server url
  var serverURL = 'http://localhost:3000/';

  var config = {};

  var server = {};
  server.list = [
    {'host': 'localhost', 'port': '27017'},
    {'host': '127.0.0.1', 'port': '27017'},
    {'host': '192.168.1.100', 'port': '27017'}
  ];
  server.selected = {};
  server.selectServer = function (selected) {
    this.selected = selected;
  };
  config.server = server;

  var database = {};
  database.list = [];
  database.selected = {};
  database.selectDatabase = function (selected) {
    this.selected = selected;
  }
  config.database = database;

  var collection = {};
  collection.list = [];
  collection.selected = {};
  collection.selectCollection = function (selected) {
    this.selected = selected;
  }
  config.collection = collection;

  var queryOptions = {};
  queryOptions.q = {};
  queryOptions.l = 10;
  queryOptions.p = 1;
  queryOptions.init = function(){
    this.q = {};
    this.p = 1;
  }
  config.queryOptions = queryOptions;

  var records = {};


  return {
    serverURL: serverURL,
    config: config,
    records: records
  };
//
//    var database = {
//        list: [],
//        selected: {}
//    }
}])
bountyMongo.factory('collection', [

  '$http',
  'bucket',

  function ($http, bucket) {
    /**
     *  @param1 : query
     *  @param2 : page
     *  @param3 : limit
     */
    return function () {
      var collection = bucket.config.collection.selected;
      var database = bucket.config.database.selected;
      var server = bucket.config.server.selected;
      var queryOptions = bucket.config.queryOptions;
      var serverURL = bucket.serverURL;

      var url = serverURL + 'servers/' + server.host + '/databases/' + database.name + '/collections/' + collection.name + '?';

      var Resource = function (data) {
        angular.extend(this, data);
      };
      Resource.query = function () {
        if (queryOptions.q)url = url + 'q=' + JSON.stringify(queryOptions.q) + '&';
        if (queryOptions.p)url = url + 'p=' + queryOptions.p + '&';
        if (queryOptions.l)url = url + 'l=' + queryOptions.l;

        return $http.get(url).then(function (response) {
          if (response.data.status === 'error') {
            bucket.records = response.data;
            return response.data.error
          }
          bucket.records = response.data.data;
          return response.data.data.find;
        });
      }
      return Resource;
    }
  }])
bountyMongo.factory('database', [

  '$http',
  'bucket',

  function ($http, bucket) {
    return function () {
      var database = bucket.config.database.selected;
      var server = bucket.config.server.selected;
      var serverURL = bucket.serverURL;
      var url = serverURL + 'servers/' + server.host + '/databases/' + database.name;
      var Resource = function (data) {
        angular.extend(this, data);
      };
      Resource.query = function () {
        return $http.get(url).then(function (response) {
          //返回该服务器上的所有collections
          var collectionsList = [];
          angular.forEach(response.data.data.collectionNames, function (value, key) {
            value.name = value.name.substr(value.name.indexOf('.') + 1);
            this.push(value);
          }, collectionsList)
          return collectionsList;
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
    return function () {
      var server = bucket.config.server.selected;
      var serverURL = bucket.serverURL;

      var url = serverURL + 'servers/' + server.host;
      var Resource = function (data) {
        angular.extend(this, data);
      };
      Resource.query = function () {
        return $http.get(url).then(function (response) {
          //返回该服务器上的所有databases
          return response.data.data.databases;
        });
      }
      return Resource;
    }
  }])
