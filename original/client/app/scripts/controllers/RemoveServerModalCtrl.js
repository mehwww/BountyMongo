bountyMongo.controller('RemoveServerModalCtrl', [

  '$scope',
  '$modalInstance',
  'server',
  'serverName',

  function ($scope, $modalInstance, server, serverName) {
    $scope.serverName = serverName;
    $scope.yes = function () {
      server(serverName).delete().then(
        function (response) {
          $modalInstance.close(response);
        },
        function (response) {
          $modalInstance.close(response);
        }
      );
    };
    $scope.no = function () {
      $modalInstance.dismiss('no');
    };
  }
])
/**
 * Created by meh on 14-2-20.
 */
