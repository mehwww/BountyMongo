bountyMongo.controller('sidebarCtrl', [

  '$scope',
  '$q',
  'bucket',
  'server',
  'database',
  'collection',

  function ($scope, $q, bucket, server, database, collection) {
    $scope.serversList = bucket.config.server.list;
    $scope.selectedServer = $scope.serversList[0];

    $scope.$watch('selectedServer', function () {
      bucket.config.server.selectServer($scope.selectedServer);
      server().query().then(function (response) {
        $scope.databasesList = response;
        $scope.selectedDatabase = null;
        $scope.selectedCollection = null;
        $scope.collections = [];
      });
    });

    $scope.$watch('selectedDatabase', function () {
      bucket.config.database.selectDatabase($scope.selectedDatabase);
      if (!$scope.selectedDatabase) return;
      database().query().then(function (response) {
        $scope.collections = response;
        $scope.collectionsList = response;
      })
    });

    $scope.$watch('selectedCollection', function () {
      bucket.config.collection.selectCollection($scope.selectedCollection);
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