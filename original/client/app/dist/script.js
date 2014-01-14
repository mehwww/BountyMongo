//"use strict"

var bountyMongo = angular.module('bountyMongo', []);



bountyMongo.controller('sidebar', [

  '$scope',
  '$q',
  'config',
  'server',
  'database',
  'collection',

  function ($scope, $q, config, server, database, collection) {
    $scope.currentPage = 3;
    $scope.numPages = 5;
    $scope.selectCount = 0;

    $scope.serversList = config.serverConfig.list;
    $scope.selectedServer = $scope.serversList[0];

    $scope.$watch('selectedServer', function () {
      config.serverConfig.selectServer($scope.selectedServer);
      server().query().then(function (response) {
        $scope.databases = response;//test use
        $scope.databasesList = response;
        $scope.selectedDatabase = null;
        $scope.collections = [];
      });
    });

    $scope.$watch('selectedDatabase', function () {
      config.databaseConfig.selectDatabase($scope.selectedDatabase);
      if (!$scope.selectedDatabase) return;
      database().query().then(function (response) {
        $scope.collections = response;
        $scope.collectionsList = response;
      })
    });

    $scope.$watch('selectedCollection', function () {
      config.collectionConfig.selectCollection($scope.selectedCollection);
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
bountyMongo.directive('pagination', function() {
  return {
    restrict: 'E',
    scope: {
      numPages: '=',
      currentPage: '='
    },
    templateUrl:'partials/page.html',
    replace: true,
    link: function(scope) {
      scope.$watch('numPages', function(value) {
        scope.pages = [];
        for(var i=1;i<=value;i++) {
          scope.pages.push(i);
        }
        if ( scope.currentPage > value ) {
          scope.selectPage(value);
        }
      });
      scope.noPrevious = function() {
        return scope.currentPage === 1;
      };
      scope.noNext = function() {
        return scope.currentPage === scope.numPages;
      };
      scope.isActive = function(page) {
        return scope.currentPage === page;
      };

      scope.selectPage = function(page) {
        if ( ! scope.isActive(page) ) {
          scope.currentPage = page;
        }
      };

      scope.selectPrevious = function() {
        if ( !scope.noPrevious() ) {
          scope.selectPage(scope.currentPage-1);
        }
      };
      scope.selectNext = function() {
        if ( !scope.noNext() ) {
          scope.selectPage(scope.currentPage+1);
        }
      };
    }
  };
});
/**
 * Created by meh on 14-1-10.
 */

bountyMongo.factory('collection', [

    '$http',
    'config',

    function ($http, config) {
        return function () {
            var collection = config.collectionConfig.selected;
            var database = config.databaseConfig.selected;
            var server = config.serverConfig.selected;
            var serverURL = config.serverURL;
            var url = serverURL + 'servers/' + server.host + '/databases/' + database.name + '/collections/' + collection.name;
            var Resource = function (data) {
                angular.extend(this, data);
            };
            Resource.query = function () {
                return $http.get(url).then(function (response) {
                    return response.data.data.find;
                });
            }
            return Resource;
        }
    }])
bountyMongo.factory('config', [function () {
    //app server url
    var serverURL = 'http://localhost:3000/';

    var serverConfig = {};
    serverConfig.list = [
        {'host': 'localhost', 'port': '27017'},
        {'host': '127.0.0.1', 'port': '27017'},
        {'host': '192.168.1.100', 'port': '27017'}
    ];
    serverConfig.selected = {};
    serverConfig.selectServer = function (selected) {
        this.selected = selected;
    };

    var databaseConfig = {};
    databaseConfig.list = [];
    databaseConfig.selected = {};
    databaseConfig.selectDatabase = function (selected) {
        this.selected = selected;
    }

    var collectionConfig = {};
    collectionConfig.list = [];
    collectionConfig.selected = {};
    collectionConfig.selectCollection = function (selected) {
        this.selected = selected;
    }


    return {
        serverURL: serverURL,
        serverConfig: serverConfig,
        databaseConfig: databaseConfig,
        collectionConfig:collectionConfig
    };
//
//    var database = {
//        list: [],
//        selected: {}
//    }
}])
bountyMongo.factory('database', [

    '$http',
    'config',

    function ($http, config) {
        return function () {
            var database = config.databaseConfig.selected;
            var server = config.serverConfig.selected;
            var serverURL = config.serverURL;
            var url = serverURL + 'servers/' + server.host + '/databases/' + database.name;
            var Resource = function (data) {
                angular.extend(this, data);
            };
            Resource.query = function () {
                return $http.get(url).then(function (response) {
                    //返回该服务器上的所有collections
                    var collectionsList = [];
                    angular.forEach(response.data.data.collectionNames,function(value,key){
                        value.name = value.name.substr(value.name.indexOf('.')+1);
                        this.push(value);
                    },collectionsList)
                    return collectionsList;
                });
            }
            return Resource;
        }
    }])

bountyMongo.factory('server', [

    '$http',
    'config',

    function ($http, config) {
        return function () {
            var server = config.serverConfig.selected;
            var serverURL = config.serverURL;

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
