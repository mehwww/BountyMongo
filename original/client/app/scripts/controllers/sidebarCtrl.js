bountyMongo.controller('SidebarCtrl', [

  '$scope',
  'bucket',
  'server',

  function ($scope, bucket, server) {
    $scope.serverList = bucket.config.serverList;
    $scope.server = $scope.serverList[0];

    $scope.$watch('server', function () {
      server($scope.server).query().then(function (response) {
        $scope.databaseList = response;
      });
    });
  }])