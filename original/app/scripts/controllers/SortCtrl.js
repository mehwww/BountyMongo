bountyMongo.controller('SortCtrl', [
  '$scope',
  function ($scope) {
    $scope.items = $scope.$parent.sortArray;

    $scope.switchValue = function (index) {
      $scope.items[index].value = 0 - $scope.items[index].value
    }
  }])