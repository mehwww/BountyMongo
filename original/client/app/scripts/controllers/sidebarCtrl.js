bountyMongo.controller('SidebarCtrl', [

  '$scope',
  '$location',
  'server',
  'database',

  function ($scope, $location, server, database) {

    server().list().then(function (response) {
      $scope.serverList = response
    })

    $scope.$watch('server', function (newVal) {
      if (newVal) {
        $location.path('/servers/' + encodeURIComponent(newVal))
        server(newVal).databases().then(function (response) {
          $scope.databaseList = response;
        }, function (response) {
          console.log('failed request!!!', response.data)
          $scope.databaseList = null;
        });
      }
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