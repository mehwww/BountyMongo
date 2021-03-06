bountyMongo.controller('AddServerModalCtrl', [

  '$scope',
  '$modalInstance',
  'server',

  function ($scope, $modalInstance, server) {
    $scope.mongodb = {}
    $scope.add = function () {
      server().add($scope.mongodb.url).then(
        function (response) {
          $modalInstance.close(response);
        }
      )
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
])