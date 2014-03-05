bountyMongo.controller('SidebarCtrl', [

  '$scope',
  '$location',
  '$routeParams',
  '$modal',
  'server',
  'database',
  'urlFactory',

  function ($scope, $location, $routeParams, $modal, server, database, urlFactory) {

    server().list().then(function (list) {
      $scope.serverList = list;
    })

    var isInitialized = true;

    $scope.$on('$routeChangeSuccess', function (event, routeData) {
      if (!isInitialized)return
      isInitialized = false;
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

      $location.path(urlFactory([$scope.server],false))
    }

    $scope.selectDatabase = function (databaseObj) {
      database($scope.server, databaseObj.name).collections().then(
        function (response) {
          databaseObj.collectionList = response
        }
      )
      databaseObj.isActive = !databaseObj.isActive
      $scope.database = databaseObj.name;

      $location.path(urlFactory([$scope.server, $scope.database],false))
    }

    $scope.selectCollection = function (databaseName, collectionName) {
      $scope.database = databaseName;
      $scope.collection = collectionName;

      $location.path(urlFactory([$scope.server, $scope.database, $scope.collection],false))
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