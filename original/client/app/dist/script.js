
//####  ./app/scripts/app.js
//"use strict"


var bountyMongo = angular.module('bountyMongo', ['ui.bootstrap', 'ngRoute', 'LocalStorageModule']);

bountyMongo
  .config([
    '$routeProvider',
    '$locationProvider',
    '$httpProvider',
    function ($routeProvider, $locationProvider, $httpProvider) {
      $routeProvider
        .when('/servers/:serverName', {
          templateUrl: '/partials/bmMain.html',
          controller: 'MainCtrl'
        })
        .when('/servers/:serverName/databases/:databaseName', {
          templateUrl: '/partials/bmMain.html',
          controller: 'MainCtrl'
        })
        .when('/servers/:serverName/databases/:databaseName/collections/:collectionName', {
          templateUrl: '/partials/bountyRecords.html',
          controller: 'MainCtrl'
        })
        .otherwise({redirectTo: '/'})

      $locationProvider.html5Mode(true);

    }])

  .constant('API_URL','/api')


//####  ./app/scripts/controllers/AddServerModalCtrl.js
bountyMongo.controller('AddServerModalCtrl', [

  '$scope',
  '$modalInstance',
  'server',

  function ($scope, $modalInstance, server) {
    $scope.mongodb = {}
    $scope.add = function () {
      server().add($scope.mongodb.url).then(
        function (response) {
          $modalInstance.close(response);
        }
      )
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
])

//####  ./app/scripts/controllers/MainCtrl.js
bountyMongo.controller('MainCtrl', [

  '$scope',
  '$location',
  '$routeParams',
  'server',
  'database',
  'collection',

  function ($scope, $location, $routeParams, server, database, collection) {
    
    console.log($routeParams)
    
    var serverName = $routeParams.serverName;
    var databaseName = $routeParams.databaseName;
    var collectionName = $routeParams.collectionName;
    if (collectionName) {
      collection(serverName, databaseName, collectionName).count().then(function (response) {
        console.log('count success', response)
      }, function (response) {
        console.log('count fail', response)
      })


      return collection(serverName, databaseName, collectionName).query().then(function (response) {
        $scope.records = response
      }, function (response) {
        $scope.records = response
      })
    }
    if (databaseName) {
      return database(serverName, databaseName).query().then(function (response) {
        $scope.records = response
      }, function (response) {
        $scope.records = response
      })
    }
    if (serverName) {
      return server(serverName).query().then(function (response) {
        $scope.records = response
      }, function (response) {
        $scope.records = response
      })
    }
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

//####  ./app/scripts/controllers/RemoveServerModalCtrl.js
bountyMongo.controller('RemoveServerModalCtrl', [

  '$scope',
  '$modalInstance',
  'server',
  'serverName',

  function ($scope, $modalInstance, server, serverName) {
    $scope.serverName = serverName;
    $scope.yes = function () {
      server(serverName).delete().then(
        function (response) {
          $modalInstance.close(response);
        }
      );
//      $modalInstance.close(server(serverName).delete())
    };
    $scope.no = function () {
      $modalInstance.dismiss('cancel');
    };
  }
])
/**
 * Created by meh on 14-2-20.
 */


//####  ./app/scripts/controllers/SidebarCtrl.js
bountyMongo.controller('SidebarCtrl', [

  '$scope',
  '$location',
  '$routeParams',
  '$modal',
  'server',
  'database',

  function ($scope, $location, $routeParams, $modal, server, database) {
    setTimeout(function () {
      //TODO:根据url改变sidebar状态
    }, 100)

    server().list().then(function (list) {
      $scope.serverList = list;
    })

    $scope.selectServer = function (serverName) {
      $scope.server = serverName;
      $scope.databaseList = null;
      server(serverName).databases().then(function (response) {
        $scope.databaseList = [];
        angular.forEach(response, function (value, key) {
          this.push({
            name: value,
            isActive: false
          })
        }, $scope.databaseList)
      })

      $location.path('/servers/' + encodeURIComponent(serverName))
    }

    $scope.selectDatabase = function (databaseObj) {
      database($scope.server, databaseObj.name).collections().then(
        function (response) {
          databaseObj.collectionList = response
        }
      )
      databaseObj.isActive = !databaseObj.isActive
      $scope.database = databaseObj;

      $location.path('/servers/' + encodeURIComponent($scope.server)
        + '/databases/' + encodeURIComponent(databaseObj.name))
    }

    $scope.selectCollection = function (database, collection) {
      $scope.database = database;
      $scope.collection = collection;

      $location.path('/servers/' + encodeURIComponent($scope.server)
        + '/databases/' + encodeURIComponent($scope.database.name)
        + '/collections/' + encodeURIComponent(collection))
    }

    $scope.addServer = function () {
      var modalInstance = $modal.open({
        templateUrl: 'addServerModal.html',
        controller: 'AddServerModalCtrl',
        windowClass: 'add-server-modal'
      });
      modalInstance.result.then(function (response) {
        server().list().then(function (list) {
          $scope.serverList = list;
          $scope.selectServer(response.name)
        });
      }, function (response) {
//        console.log('Modal dismissed at: ' + new Date());
      });
    }

    $scope.removeServer = function () {
      var modalInstance = $modal.open({
        templateUrl: 'removeServerModal.html',
        controller: 'RemoveServerModalCtrl',
        windowClass: 'remove-server-modal',
        resolve: {
          serverName: function () {
            return $scope.server
          }
        }
      })
      modalInstance.result.then(function (response) {
        server().list().then(function (list) {
          $scope.serverList = list;
          $scope.selectServer(null)
        });
      }, function () {
//        console.log('Modal dismissed at: ' + new Date());
      });
    }

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
  '$location',
  'database',
  'collection',
  function ($location, database, collection) {
    return {
      restrict: 'AE',
//      replace:true,
//      template:'<div>asdfasdf</div> ',
      templateUrl: '/partials/bmSidebar.html',
      link: function (scope, element, attrs) {
//        console.log('bmSidebarDirective')
//        console.log('server',scope.server)
//        console.log('database',scope.database)
        scope.toggleDatabase = function () {
          scope.isOpen = !scope.isOpen;
          $location.path('/servers/' + encodeURIComponent(scope.server) + '/databases/' + encodeURIComponent(scope.database))
          database(scope.server, scope.database).collections().then(function (response) {
            scope.collectionList = response
          })
        }

        scope.selectCollection = function (collection) {
          scope.collection = collection
          $location.path('/servers/' + encodeURIComponent(scope.server)
            + '/databases/' + encodeURIComponent(scope.database)
            + '/collections/' + encodeURIComponent(collection))
        }
//        scope.toggleDatabase = function () {
//          scope.isOpen = !scope.isOpen;
//          if (scope.isOpen) {
//            records.server(scope.server);
//            records.database(scope.database);
//            records.collection('');
//          }
//          console.log('scope.server',scope.server)
//          console.log('scope.database',scope.database)
//          //scope.server is prototypically inheritance from parent
//          collection(scope.server, scope.database.name).list().then(function (response) {
//            scope.collectionList = response.collectionNames;
//          })
//        }
//        scope.selectCollection = function (coll) {
//          records.server(scope.server);
//          records.database(scope.database);
//          records.collection(coll);
//          records.queryOptions('p',1);
//          records.recordsRefresh();
//        }
      }
    }
  }])

//####  ./app/scripts/services/bucket.js
bountyMongo.factory('bucket', ['$parse', function ($parse) {
  //app server url
  var serverURL = '/api';

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
  'localStorageService',
  'API_URL',

  function ($http, localStorageService, API_URL) {
    return function (serverName, databaseName, collectionName) {
      var serverUrl = ''
      if (typeof serverName !== undefined) {
        serverUrl = localStorageService.get('bounty_servers')[serverName]
      }

      var Resource = {};
      Resource.list = function () {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName)
          + '/collections/';
        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            return response.data;
          })
      }

      Resource.query = function (queryOptions) {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName)
          + '/collections/' + encodeURIComponent(collectionName);

        if (queryOptions) {
          url = url + '?';
          if (queryOptions.q)url = url + 'q=' + JSON.stringify(queryOptions.q) + '&';
          if (queryOptions.p)url = url + 'p=' + queryOptions.p + '&';
          if (queryOptions.l)url = url + 'l=' + queryOptions.l;
        }

        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            return response.data
          });
      }

      Resource.count = function (queryOptions) {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName)
          + '/collections/' + encodeURIComponent(collectionName)
          + '/count/';

        if (queryOptions) {
          url = url + '?';
          if (queryOptions.q)url = url + 'q=' + JSON.stringify(queryOptions.q) + '&';
          if (queryOptions.p)url = url + 'p=' + queryOptions.p + '&';
          if (queryOptions.l)url = url + 'l=' + queryOptions.l;
        }

        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            return response.data
          }, function (response) {
            return response.data
          });
      }


      return Resource;
    }
  }])

//####  ./app/scripts/services/database.js
bountyMongo.factory('database', [

  '$http',
  'localStorageService',
  'API_URL',

  function ($http, localStorageService, API_URL) {
    return function (serverName, databaseName) {

      var serverUrl = ''
      if (typeof serverName !== undefined) {
        serverUrl = localStorageService.get('bounty_servers')[serverName]
      }

      var Resource = {}

      Resource.query = function () {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName);
        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            return response.data;
          });
      }

      Resource.collections = function () {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName)
          + '/collections';
        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            var collectionList = [];
            angular.forEach(response.data, function (value, key) {
              this.push(value.name.substr(value.name.indexOf('.') + 1))
            }, collectionList)
            return collectionList;
          })
      }
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
  '$q',
  'localStorageService',
  'urlParser',
  'API_URL',

  function ($http, $q, localStorageService, urlParser, API_URL) {
    return function (serverName) {

      var serverUrl = ''
      if (typeof serverName !== undefined) {
        serverUrl = localStorageService.get('bounty_servers')[serverName]
      }

      var Resource = {};

      Resource.list = function () {
        var deferred = $q.defer();
        var list = [];
        angular.forEach(localStorageService.get('bounty_servers'), function (value, key) {
          this.push(key);
        }, list);
        deferred.resolve(list);

        return deferred.promise;
      };

      Resource.query = function () {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(
          function (response) {
            return response.data;
          },
          function (response) {
            return response.data
          }
        );
      };

      Resource.add = function (mongodbUrl) {
        var serverList = localStorageService.get('bounty_servers');
        var server = urlParser(mongodbUrl)
        if (!angular.isObject(serverList) || angular.isArray(serverList)) serverList = {};
        serverList[server.name] = server.url
        localStorageService.add('bounty_servers', serverList)

        var deferred = $q.defer();
        deferred.resolve(server);
        return deferred.promise;
      }

      Resource.delete = function () {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
        var serverList = localStorageService.get('bounty_servers');
        delete serverList[serverName];
        localStorageService.add('bounty_servers', serverList);

        return $http.delete(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            var list = [];
            angular.forEach(serverList, function (value, key) {
              this.push(key);
            }, list);
            return list;
          })
      }

      Resource.databases = function () {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/'
        return $http.get(url, {
          headers: {
            'Mongodb-Url': 'mongodb://' + serverUrl
          }
        }).then(function (response) {
            var databases = [];
            if (angular.isArray(response.data)) {
              angular.forEach(response.data, function (value, key) {
                this.push(value.name)
              }, databases)
            }
            else {
              databases.push(response.data.db)
            }
            return databases;
          }
        );
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


//####  ./app/scripts/services/urlParser.js
bountyMongo.factory('urlParser', [function () {
  return function (mongodbUrl) {
    var connectionPart = '';
    var authPart = '';
    var queryStringPart = '';

    var username = '';
    var password = '';

    var serverName = '';

    if (mongodbUrl.indexOf("?") != -1) {
      connectionPart = mongodbUrl.split("?")[0];
      queryStringPart = mongodbUrl.split("?")[1];
    }
    else {
      connectionPart = mongodbUrl;
    }

    if (connectionPart.indexOf("@") != -1) {
      authPart = connectionPart.split("@")[0];
      connectionPart = connectionPart.split("@")[1];

      username = authPart.split(":")[0];
      password = authPart.split(":")[1];

      serverName = username + '@' + connectionPart;
    }
    else {
      serverName = mongodbUrl;
    }

    return {
      name: serverName,
      url: mongodbUrl
    }
  }
}])
