
//####  ./app/scripts/app.js
//"use strict"


var bountyMongo = angular.module('bountyMongo', ['ui.ace','ui.bootstrap', 'ngRoute', 'LocalStorageModule']);

bountyMongo
  .config([
    '$routeProvider',
    '$locationProvider',
    '$httpProvider',
    function ($routeProvider, $locationProvider, $httpProvider) {
      $routeProvider
        .when('/',{
          templateUrl:'blank.html'
        })
        .when('/servers/:serverName', {
          templateUrl: '/partials/bountyMain.html',
          controller: 'MainCtrl'
        })
        .when('/servers/:serverName/databases/:databaseName', {
          templateUrl: '/partials/bountyMain.html',
          controller: 'MainCtrl'
        })
        .when('/servers/:serverName/databases/:databaseName/collections/:collectionName', {
          templateUrl: '/partials/bountyRecords.html',
          controller: 'RecordsCtrl'
        })
        .otherwise({redirectTo: '/'})

      $locationProvider.html5Mode(true);

    }])

  .constant('API_URL','/api')


//####  ./app/scripts/controllers/AddDatabaseModalCtrl.js
bountyMongo.controller('AddDatabaseModalCtrl', [

  '$scope',
  '$modalInstance',
  '$location',
  'serverName',
  'databaseList',

  function ($scope, $modalInstance, $location, serverName, databaseList) {
    console.log(databaseList)
    $scope.database = {}
    $scope.add = function () {
      if (databaseList.indexOf($scope.database.name) != -1) {
        return alert('Database Already Exist')
      }
      $location.path('/servers/' + encodeURIComponent(serverName)
        + '/databases/' + encodeURIComponent($scope.database.name))
      $modalInstance.close($scope.database.name);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }])

//####  ./app/scripts/controllers/AddDocumentModalCtrl.js
bountyMongo.controller('AddDocumentModalCtrl', [

  '$scope',
  '$routeParams',
  '$modalInstance',
  'collection',

  function ($scope, $routeParams, $modalInstance, collection) {
    var serverName = $routeParams.serverName;
    var databaseName = $routeParams.databaseName;
    var collectionName = $routeParams.collectionName;

    $scope.aceLoad = function (_editor) {
      var _session = _editor.getSession();
      _session.setTabSize(2);
      _session.on("change", function (e) {
        $scope.document = _session.getValue()
      });
    }

    $scope.aceOption = {
      useWrapMode: false,
      mode: 'json',
      onLoad: $scope.aceLoad
    }

    $scope.$watch('document', function (newVal) {
      console.log(newVal)
    })

    $scope.add = function () {
      var document = {};
      try {
        document = JSON.parse($scope.document)
        console.log(document);
        collection(serverName, databaseName, collectionName).add(document).then(function (response) {
          $modalInstance.close(response)
        }, function (response) {
          console.log(response.data)
        })
      }
      catch (e) {
        console.log('Invaild JSON')
      }
    }

    $scope.cancel = function(){
      $modalInstance.dismiss();
    }

  }
])


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

//    console.log($routeParams)
    
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



//    $scope.pageSizeOptions = [5, 10, 20, 50, 100, 200];
//    $scope.pageSize = $scope.pageSizeOptions[2];
//
//    $scope.$watch('pageSize', function (newVal) {
//      records.queryOptions('l', newVal);
//      records.queryOptions('p', 1)
//      records.recordsRefresh();
//    })
//
//    $scope.openModal = function(){
//      var modalInstance = $modal.open({
//        templateUrl: 'addDocumentModal.html'
//      });

//      modalInstance.result.then(function (selectedItem) {
//        $scope.selected = selectedItem;
//      }, function () {
//        $log.info('Modal dismissed at: ' + new Date());
//      });
//    }
  }])

//####  ./app/scripts/controllers/RecordsCtrl.js
bountyMongo.controller('RecordsCtrl', [

  '$scope',
  '$location',
  '$route',
  '$routeParams',
  '$modal',
  'server',
  'database',
  'collection',

  function ($scope, $location, $route, $routeParams, $modal, server, database, collection) {
    var serverName = $routeParams.serverName;
    var databaseName = $routeParams.databaseName;
    var collectionName = $routeParams.collectionName;

    var loadRecords = function (options) {
      options = options || {};
      collection(serverName, databaseName, collectionName)
        .query({
          p: options.page || $scope.page,
          l: options.pageSize || $scope.pageSize
        })
        .then(function (response) {
          $scope.records = response
        }, function (response) {
          console.log('Get Records Fail', response)
        })

      collection(serverName, databaseName, collectionName).count().then(function (response) {
        $scope.count = response.count;
      }, function (response) {
        console.log('count fail', response)
      })

    }

    $scope.page = 1;
    $scope.pageSize = 20


    loadRecords()

    $scope.$on('selectPage', function (event, page) {
//      console.log($scope.page)
      loadRecords({page: page})
//      setTimeout(function () {
//        console.log($scope.page)
//      }, 100)
    });

    $scope.addDocument = function () {
      var modalInstance = $modal.open({
        templateUrl: 'addDocumentModal.html',
        controller: 'AddDocumentModalCtrl',
        windowClass: 'add-document-modal'
      })
      modalInstance.result.then(function (response) {
        $route.reload()
        console.log(response)
      }, function () {
//        console.log('Modal dismissed at: ' + new Date());
      });
    }

    $scope.toggleOperation = function () {
      $scope.isMore = !$scope.isMore
    }

    $scope.query = function () {
      $scope.page = 5
      loadRecords()
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

    server().list().then(function (list) {
      $scope.serverList = list;
    })

    var self = this;
    self.isInitialized = true;


    $scope.$on('$routeChangeSuccess', function (event, routeData) {
      if (!self.isInitialized)return
      self.isInitialized = false;
      //stupid
      var serverName = routeData.params.serverName;
      var databaseName = routeData.params.databaseName;
//      var collectionName = routeData.params.collectionName;

      if (databaseName) {
        if ($scope.serverList.indexOf(serverName) === -1) return $location.path('/');
        $scope.server = serverName;
        $scope.databaseList = null;
        return server(serverName).databases().then(function (response) {
//          console.log((databaseName))
//          if (response.indexOf(databaseName) === -1) return $location.path('/');
          database(serverName, databaseName)
            .collections()
            .then(function (collectionList) {
              $scope.databaseList = [];
              angular.forEach(response, function (value, key) {
                this.push({
                  name: value,
                  isActive: value == databaseName,
                  collectionList: value == databaseName
                    ? collectionList
                    : null
                })
              }, $scope.databaseList)
            })
        })
      }


      if (serverName) {
        if ($scope.serverList.indexOf(serverName) === -1) return $location.path('/');
        $scope.server = serverName;
        $scope.databaseList = null;
        return server(serverName).databases().then(function (response) {
          $scope.databaseList = [];
          angular.forEach(response, function (value, key) {
            this.push({
              name: value,
              isActive: false
            })
          }, $scope.databaseList)
        })
      }
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

    $scope.addDatabase = function () {
      var modalInstance = $modal.open({
        templateUrl: 'addDatabaseModal.html',
        controller: 'AddDatabaseModalCtrl',
        windowClass: 'add-database-modal',
        resolve: {
          serverName: function () {
            return $scope.server
          },
          databaseList: function () {
            var databaseList = [];
            angular.forEach($scope.databaseList, function (value, key) {
              this.push(value.name)
            }, databaseList)
            return databaseList
          }
        }
      })

      modalInstance.result.then(function (database) {
        $scope.databaseList.push({
          name: database,
          isActive: false
        })
      })

    }

  }])

//####  ./app/scripts/directives/bountyDocument.js
bountyMongo.directive('bountyDocument', [function () {
  return {
    restrict: 'E',
    scope: {
      document: '='
    },
    templateUrl: '/partials/bountyDocument.html',
    replace: true,
    link: function (scope, element, attr) {
//      scope.document =
    }
  }
}])

//####  ./app/scripts/directives/bountyPagination.js
bountyMongo.directive('bountyPagination', [

  function () {
    return {
      restrict: 'E',
      scope: {
        currentPage: '=',
        totalItems:'=',
        itemsPerPage:'='
      },
      templateUrl: '/partials/bountyPagination.html',
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
          //pagination config : maxsize
          var maxsize = 9;
          var half = Math.ceil(maxsize / 2)
          var min = (currentPage > half) ? Math.max(currentPage - (half - 3), 1) : 1;
          var max = (totalPages - currentPage > half) ? Math.min(currentPage + (half - 3), totalPages) : totalPages;
          var start = (max === totalPages) ? Math.max(totalPages - (maxsize - 3), 1) : min;
          var end = (min === 1) ? Math.min(start + (maxsize - 3), totalPages) : max;

          if (end >= totalPages - 2) {
            end = totalPages;
          }
          if (start <= 3) {
            start = 1;
          }

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
            scope.$emit('selectPage',page);
          }
        }

        scope.$watch('currentPage', function (newValue,oldValue) {
          scope.pages = getPages(scope.currentPage, scope.totalPages);
        });

        scope.$watch('totalItems', function (newValue) {
          scope.currentPage = 1;
          scope.totalPages =  calculateTotalPages(scope.totalItems,scope.itemsPerPage)
          scope.pages = getPages(scope.currentPage, scope.totalPages);
        });

        scope.$watch('itemsPerPage', function (newValue) {
          scope.currentPage = 1;
          scope.totalPages =  calculateTotalPages(scope.totalItems,scope.itemsPerPage)
          scope.pages = getPages(scope.currentPage, scope.totalPages);
        });
      }
    };
  }]);

//####  ./app/scripts/directives/bountySortItems.js
bountyMongo.directive('bountySortItems', [
  function () {
    return{
      restrict: 'E',
      scope: {
        sort: '='
      },
      templateUrl: '/partials/bountySortItems.html',
      replace: true,
      link: function (scope, element, attrs) {
        scope.sort = []
        var sort = scope.sort
        var sortNames = []
        var newSortItem;

        sort.push({
          name: '_id',
          order: 1
        })

        scope.changeOrder = function (index) {
          sort[index].order = 0 - sort[index].order
        }

        scope.removeSortItem = function (index) {
          sortNames.splice(sortNames.indexOf(sort[index].name),1)
          sort.splice(index, 1);
        };

        scope.addSortItem = function () {
          if(sortNames.indexOf(scope.newSortItemName) === -1){
            sort.push({
              name:scope.newSortItemName,
              order:1
            })
            sortNames.push(scope.newSortItemName);
          }
        }

        scope.$watch('sort', function (newValue, oldValue) {
          console.log(newValue)
        },true);

      }
    }
  }
])

//####  ./app/scripts/filters/sort.js
bountyMongo.filter('sort', [function () {
  return function (input) {
    if(input===1)return 'AES'
    if(input===-1)return 'DESC'
    return null
  }
}]);



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

      Resource.add = function (document) {
        var url = API_URL
          + '/servers/' + encodeURIComponent(serverName)
          + '/databases/' + encodeURIComponent(databaseName)
          + '/collections/' + encodeURIComponent(collectionName)
        return $http.post(url,
          {
            document: document
          },
          {
            headers: {
              'Mongodb-Url': 'mongodb://' + serverUrl
            }
          }).then(function (response) {
            return response.data;
          })

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


//####  ./app/scripts/services/server.js
bountyMongo.factory('server', [

  '$http',
  '$q',
  'localStorageService',
  'urlParser',
  'API_URL',

  function ($http, $q, localStorageService, urlParser, API_URL) {
    if(!localStorageService.get('bounty_servers')){
      localStorageService.add('bounty_servers',[])
    }

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
