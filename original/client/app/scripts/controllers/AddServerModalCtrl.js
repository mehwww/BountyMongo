bountyMongo.controller('AddServerModalCtrl', [

  '$scope',
  '$modalInstance',
  'server',

  function ($scope, $modalInstance, server) {
    $scope.mongodb = {}
    $scope.add = function () {
      $modalInstance.close(server().add($scope.mongodb.url));
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
])