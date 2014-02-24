bountyMongo.controller('RemoveServerModalCtrl', [

  '$scope',
  '$modalInstance',
  'server',
  'serverName',

  function ($scope, $modalInstance, server, serverName) {
    $scope.serverName = serverName;
    $scope.yes = function () {
//      server(serverName).delete().then(
//        function (response) {
//          $modalInstance.close(response);
//        },
//        function (response) {
//          $modalInstance.dismiss(response);
//        }
//      );
      $modalInstance.close(server(serverName).delete())
    };
    $scope.no = function () {
      $modalInstance.dismiss('cancel');
    };
  }
])
/**
 * Created by meh on 14-2-20.
 */
