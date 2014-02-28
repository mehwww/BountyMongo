bountyMongo.controller('RecordsCtrl', [

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

    collection(serverName, databaseName, collectionName).count().then(function (response) {
      $scope.count = response.count;
    }, function (response) {
//      console.log('count fail', response)
    })

    $scope.page = 1;
//    $scope.count = 2000;
    $scope.pageSize = 20

    $scope.$watch('page', function (newValue, oldValue) {
//      console.log('page', newValue)
      collection(serverName, databaseName, collectionName)
        .query({
          p: newValue,
          l: $scope.pageSize
        })
        .then(function (response) {
          $scope.records = response
        }, function (response) {
          console.log('Get Records Fail', response)
        })
    });


//    collection(serverName, databaseName, collectionName).query().then(function (response) {
//      $scope.records = response
//    }, function (response) {
//      console.log('Get Records Fail', response)
//    })

  }])