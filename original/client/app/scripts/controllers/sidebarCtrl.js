bountyMongo.controller('SidebarCtrl', [

  '$scope',
  '$q',
  'bucket',
  'server',
  'database',
  'collection',

  function ($scope, $q, bucket, server, database, collection) {
    $scope.serverList = bucket.config.server.list;
    $scope.server = $scope.serverList[0];

    $scope.$watch('server', function () {
//      bucket.config.server.selectServer($scope.selectedServer);
      server($scope.server).query().then(function (response) {
        $scope.databaseList = response;
      });
    });

//    $scope.$watch('selectedDatabase', function () {
//      bucket.config.database.selectDatabase($scope.selectedDatabase);
//      if (!$scope.selectedDatabase) return;
//      database($scope.selectedServer,$scope.selectedDatabase).query().then(function (response) {
//        $scope.collections = response;
//        $scope.collectionsList = response;
//      })
//    });
//
//    $scope.$watch('selectedCollection', function () {
//      bucket.config.collection.selectCollection($scope.selectedCollection);
//      if (!$scope.selectedCollection) return;
//      collection().query().then(function (response) {
//        $scope.documents = response;
//      })
//    })

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