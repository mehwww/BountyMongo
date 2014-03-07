bountyMongo.controller('FieldsCtrl', [
  '$scope',
  function ($scope) {
    $scope.items = $scope.$parent.fieldsArray;

    $scope.switchValue = function (index) {
      $scope.items[index].value = $scope.items[index].value ? 0 : 1
    }
  }])