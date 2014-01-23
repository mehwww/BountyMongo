bountyMongo.controller('SidebarCtrl', [

  '$scope',
  'records',
  'server',
  'bucket',

  function ($scope, records, server,bucket) {
    $scope.serverList = bucket.serverList;
    $scope.server = $scope.serverList[0];

    $scope.$watch('server', function (newVal) {
      records.server(newVal);
      records.database('');
      records.collection('');


      server(newVal).query().then(function (response) {
        $scope.databaseList = response.databases;
      },function(response){
        console.log('failed request!!!',response)
      });
    });
  }])