//"use strict"

var bountyMongo = angular.module('bountyMongo', []);



bountyMongo.controller('MainCtrl', [

  '$scope',
  'bucket',
  'collection',

  function ($scope, bucket,collection) {


  }])
bountyMongo.controller('QueryCtrl',['$scope','bucket','collection',function($scope,bucket,collection){
  $scope.pageSizeOptions = [5,10,20,50,100,200];
  $scope.pageSize = $scope.pageSizeOptions[0];

  $scope.$watch('pageSize',function(newVal){
    bucket.queryOptions('l',newVal);
    var server = bucket.queryOptions('server');
    var database = bucket.queryOptions('database');
    var coll = bucket.queryOptions('collection');
    if(!coll)return;
    collection(server,database,coll,bucket.queryOptions()).query().then(function (response) {
      bucket.records = response;
    })
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
bountyMongo.directive('pagination', ['bucket', function (bucket) {
  return {
    restrict: 'E',
    scope: {
      totalItems: '=',
      currentPage: '='
    },
    templateUrl: './partials/pagination.html',
//    controller: 'PaginationController',
    replace: true,
    link: function (scope, element, attrs) {

      var isActive = function (page) {
        return scope.currentPage === page;
      };

      var calculateTotalPages = function () {
        var itemsPerPage = bucket.queryOptions('l');
        var totalPages = itemsPerPage < 1 ? 1 : Math.ceil(scope.totalItems / itemsPerPage);
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
        if(totalPages===1)return;
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
        if(start>3){
          var page = makePage(0,'...',false,true);
          pages.unshift(page);
          page = makePage(1,1,isActive(1),false);
          pages.unshift(page);
        }
        if(end < totalPages -2){
          var page = makePage(0,'...',false,true);
          pages.push(page);
          page = makePage(totalPages,totalPages,isActive(totalPages),false);
          pages.push(page);
        }
        //add 'Previous' and 'Next'
        pages.unshift(makePage(currentPage-1,'Previous',false,scope.currentPage === 1))
        pages.push(makePage(currentPage+1,'Next',false,scope.currentPage === scope.totalPages))

        return pages;
      }

      scope.selectPage = function(page){
        if(!isActive(page) && page>0 && page<= scope.totalPages){
          scope.currentPage = page;
          scope.pages = getPages(scope.currentPage, scope.totalPages);
        }
      }

      scope.$watch('currentPage', function () {
        scope.pages = getPages(scope.currentPage, scope.totalPages);
      });

//      scope.$on('recordsRefresh', function (event) {
//        scope.currentPage = 1;
//        scope.totalPages = calculateTotalPages();
//        scope.pages = getPages(scope.currentPage, scope.totalPages);
//      });

      scope.$watch('totalItems', function () {
        scope.currentPage = 1;
        scope.totalPages = calculateTotalPages();
        scope.pages = getPages(scope.currentPage, scope.totalPages);
      });
      
      scope.$watch(function(){
        return bucket.queryOptions('l')
      }, function (newVal) {
        console.log(newVal)
        scope.currentPage = 1;
        scope.totalPages = calculateTotalPages();
        scope.pages = getPages(scope.currentPage, scope.totalPages);
      });
    }
  };
}]);
bountyMongo.directive('records', ['bucket','collection', function (bucket,collection) {
  return{
    restrict:'E',
    scope:{
      records:'='
    },
    templateUrl: './partials/records.html',
    link: function (scope, element, attrs) {
      scope.$watch(
        function () {
          return bucket.records
        },
        function (newVal) {
          scope.records = newVal;
        });

      scope.$watch('page', function (newValue, oldValue) {
        bucket.queryOptions('p',scope.page);
        var server = bucket.queryOptions('server');
        var database = bucket.queryOptions('database');
        var coll = bucket.queryOptions('collection');
        if(!coll)return;
        collection(server,database,coll,bucket.queryOptions()).query().then(function (response) {
          bucket.records = response;
        })
//        console.log(newValue)
      });
    }
  }
}]);
bountyMongo.directive('sidebarDatabase', ['$rootScope','database', 'collection','bucket', function ($rootScope,database, collection,bucket) {
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
        bucket.queryOptions('server',scope.server);
        bucket.queryOptions('database', scope.database);
        bucket.queryOptions('collection', coll);
        collection(scope.server, scope.database, coll,bucket.queryOptions()).query().then(function (response) {
          bucket.records = response;
        })
      }
    }
  }

}])
bountyMongo.factory('bucket', ['$parse', function ($parse) {
  //app server url
  var serverURL = 'http://localhost:3000/';

  var paginationConfig = {
//    itemsPerPage:50,
    maxsize:9
  };

  var serverList = [
    {'host': 'localhost', 'port': '27017'},
    {'host': '127.0.0.1', 'port': '27017'},
    {'host': '192.168.1.100', 'port': '27017'}
  ];

  var queryOptions = {
    p:1,
    l:50
  };

  var records = {};


  return {
    serverURL: serverURL,
    serverList:serverList,
    paginationConfig: paginationConfig,
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
