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