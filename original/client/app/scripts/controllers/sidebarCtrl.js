bountyMongo.controller('SidebarCtrl', [

  '$scope',
  '$location',
  '$route',
  '$modal',
  'server',
  'database',

  function ($scope, $location, $route, $modal, server, database) {
    server().list().then(function (response) {
      $scope.serverList = response;
      $scope.server = $scope.serverList[0];
    })

    $scope.selectServer = function (server) {
      $scope.server = server;
    }

    $scope.selectDatabase = function (database) {
      database.isActive = !database.isActive
      $scope.database = database;
    }

    $scope.selectCollection = function (database, collection) {
//      console.log(collection)
      $scope.database = database;
      $scope.collection = collection;
    }

    $scope.addServer = function () {
      var modalInstance = $modal.open({
        templateUrl: 'addServerModal.html',
        controller: 'AddServerModalCtrl',
        windowClass: 'add-server-modal'
      });
      modalInstance.result.then(function (mongodb) {
        console.log('mongodb', mongodb)
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
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
      modalInstance.result.then(function (remove) {
        console.log('remove', remove)
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }


    $scope.$watch('server', function (newVal) {
      if (!newVal) return
      $location.path('/servers/' + encodeURIComponent(newVal))
      server(newVal).databases().then(
        function (response) {
          $scope.databaseList = [];
          _.each(response, function (element) {
            $scope.databaseList.push({
              name: element,
              isActive: false
            })
          })
        },
        function (response) {
          console.log('failed request!!!', response.data)
          $scope.databaseList = [];
        }
      );
    })

    $scope.$watch('database', function (newVal) {
      if (!newVal) return
      $location.path('/servers/' + encodeURIComponent($scope.server)
        + '/databases/' + encodeURIComponent(newVal.name))
      database($scope.server, newVal.name).collections().then(
        function (response) {
          newVal.collectionList = response;
        }
      )
    })

    $scope.$watch('collection', function (newVal) {
      if (!newVal) return
      $location.path('/servers/' + encodeURIComponent($scope.server)
        + '/databases/' + encodeURIComponent($scope.database.name)
        + '/collections/' + encodeURIComponent(newVal))
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