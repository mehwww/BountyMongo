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
      console.log('count success', response)
    }, function (response) {
      console.log('count fail', response)
    })


    return collection(serverName, databaseName, collectionName).query().then(function (response) {
      $scope.records = response
    }, function (response) {
      $scope.records = response
    })

  }])