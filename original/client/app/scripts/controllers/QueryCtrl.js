bountyMongo.controller('QueryCtrl', [

  '$scope',
  'records',

  function ($scope, records) {
    $scope.pageSizeOptions = [5, 10, 20, 50, 100, 200];
    $scope.pageSize = $scope.pageSizeOptions[2];

    $scope.$watch('pageSize', function (newVal) {
      records.queryOptions('l', newVal);
      records.queryOptions('p', 1)
      records.recordsRefresh();
    })
  }])