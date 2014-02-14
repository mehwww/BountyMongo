bountyMongo.controller('SidebarCtrl', [

  '$scope',
  'records',
  'server',
  'bucket',

  function ($scope, records, server,bucket) {
    
    server().list().then(function(response){
      $scope.serverList = response;
      $scope.server = $scope.serverList[0];
      console.log($scope.serverList)
    })
    
    $scope.$watch('server',function(newVal){
      console.log(newVal)
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