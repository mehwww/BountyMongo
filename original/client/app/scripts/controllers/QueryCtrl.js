bountyMongo.controller('QueryCtrl', [

  '$scope',
  '$modal',
  'records',

  function ($scope,$modal, records) {



//    $scope.pageSizeOptions = [5, 10, 20, 50, 100, 200];
//    $scope.pageSize = $scope.pageSizeOptions[2];
//
//    $scope.$watch('pageSize', function (newVal) {
//      records.queryOptions('l', newVal);
//      records.queryOptions('p', 1)
//      records.recordsRefresh();
//    })
//
//    $scope.openModal = function(){
//      var modalInstance = $modal.open({
//        templateUrl: 'addDocumentModal.html'
//      });

//      modalInstance.result.then(function (selectedItem) {
//        $scope.selected = selectedItem;
//      }, function () {
//        $log.info('Modal dismissed at: ' + new Date());
//      });
//    }
  }])