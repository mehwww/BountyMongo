bountyMongo.controller('SidebarCtrl', [

  '$scope',
  '$location',
  '$route',
  '$modal',
  'server',
  'database',
  'localStorageService',

  function ($scope, $location, $route, $modal, server, database, localStorageService) {
//    console.log(server().list())
//    $scope.serverList = server().list();
//    $scope.server = $scope.serverList[0];
//    localStorageService.clearAll();

    server().list().then(function (list) {
      console.log(list)
      $scope.serverList = list;
    })

    $scope.selectServer = function (serverName) {
      $scope.server = serverName;
      server(serverName).databases().then(function (response) {
        console.log(response)
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


//
//    $scope.selectDatabase = function (database) {
//      database.isActive = !database.isActive
//      $scope.database = database;
//    }
//
    $scope.selectCollection = function (database, collection) {
      console.log(database)
      $scope.database = database;
      $scope.collection = collection;
      $location.path('/servers/' + encodeURIComponent($scope.server)
        + '/databases/' + encodeURIComponent($scope.database.name)
        + '/collections/' + encodeURIComponent(collection))
    }
//
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
//
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
//
//
//    $scope.$watch('server', function (newVal) {
//      if (!newVal) $location.path('/')
//      $location.path('/servers/' + encodeURIComponent(newVal))
//      server(newVal).databases().then(
//        function (response) {
//          $scope.databaseList = [];
//          _.each(response, function (element) {
//            $scope.databaseList.push({
//              name: element,
//              isActive: false
//            })
//          })
//        },
//        function (response) {
//          console.log('failed request!!!', response.data)
//          $scope.databaseList = [];
//        }
//      );
//    })
//
//    $scope.$watch('database', function (newVal) {
//      if (!newVal) return
//      $location.path('/servers/' + encodeURIComponent($scope.server)
//        + '/databases/' + encodeURIComponent(newVal.name))
//      database($scope.server, newVal.name).collections().then(
//        function (response) {
//          newVal.collectionList = response;
//        }
//      )
//    })
//
//    $scope.$watch('collection', function (newVal) {
//      if (!newVal) return
//      $location.path('/servers/' + encodeURIComponent($scope.server)
//        + '/databases/' + encodeURIComponent($scope.database.name)
//        + '/collections/' + encodeURIComponent(newVal))
//    })
//
//
  }])