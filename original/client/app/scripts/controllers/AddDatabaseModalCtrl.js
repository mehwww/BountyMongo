bountyMongo.controller('AddDatabaseModalCtrl', [

  '$scope',
  '$modalInstance',
  '$location',
  'serverName',
  'databaseList',

  function ($scope, $modalInstance, $location, serverName, databaseList) {
    console.log(databaseList)
    $scope.database = {}
    $scope.add = function () {
      if (databaseList.indexOf($scope.database.name) != -1) {
        return alert('Database Already Exist')
      }
      $location.path('/servers/' + encodeURIComponent(serverName)
        + '/databases/' + encodeURIComponent($scope.database.name))
      $modalInstance.close($scope.database.name);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }])