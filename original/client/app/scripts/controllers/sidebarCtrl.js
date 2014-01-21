bountyMongo.controller('SidebarCtrl', [

  '$scope',
  'bucket',
  'server',

  function ($scope, bucket, server) {
    $scope.serverList = bucket.serverList;
    $scope.server = $scope.serverList[0];

    $scope.$watch('server', function (newVal) {
      server(newVal).query().then(function (response) {
        $scope.databaseList = response;
        bucket.queryOptions('server',newVal);
        bucket.queryOptions('database','');
        bucket.queryOptions('collection','');
      });
    });
  }])