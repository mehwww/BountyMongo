bountyMongo.controller('SidebarCtrl', [

  '$scope',
  '$location',
  '$route',
  'server',
  'database',

  function ($scope, $location, $route, server, database) {
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

    $scope.selectCollection = function (database,collection) {
//      console.log(collection)
      $scope.database = database;
      $scope.collection = collection;
    }

//    console.log('server',$scope.server)
//    console.log('database',$scope.database)
//    console.log('collection',$scope.collection)

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