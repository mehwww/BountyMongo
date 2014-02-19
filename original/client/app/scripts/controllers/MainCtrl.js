bountyMongo.controller('MainCtrl', [

  '$scope',
  '$location',
  '$routeParams',
  'server',
  'database',
  'collection',

  function ($scope, $location, $routeParams, server, database, collection) {
//    $scope.$on('recordsRefresh', function (event, response) {
////      $scope.records = $location.path();
////      $scope.records = response;
//    })
    var serverName = $routeParams.serverName;
    var databaseName = $routeParams.databaseName;
    var collectionName = $routeParams.collectionName;
//    console.log('$routeParams',$routeParams)
    if (collectionName) {
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
//    server(serverName).query().then(function (response) {
//      $scope.records = response
//    })
//    collection(serverName, databaseName, collectionName).query().then(function () {
//      $scope.records = response
//    })
  }])