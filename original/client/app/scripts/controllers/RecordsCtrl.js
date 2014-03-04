bountyMongo.controller('RecordsCtrl', [

  '$scope',
  '$location',
  '$route',
  '$routeParams',
  '$modal',
  'server',
  'database',
  'collection',

  function ($scope, $location, $route, $routeParams, $modal, server, database, collection) {
    var serverName = $routeParams.serverName;
    var databaseName = $routeParams.databaseName;
    var collectionName = $routeParams.collectionName;

    var loadRecords = function (options) {
      options = options || {};
      collection(serverName, databaseName, collectionName)
        .query({
          p: options.page || $scope.page,
          l: options.pageSize || $scope.pageSize
        })
        .then(function (response) {
          $scope.records = response
        }, function (response) {
          console.log('Get Records Fail', response)
        })

      collection(serverName, databaseName, collectionName).count().then(function (response) {
        $scope.count = response.count;
      }, function (response) {
        console.log('count fail', response)
      })

    }

    $scope.page = 1;
    $scope.pageSize = 20


    loadRecords()

    $scope.$on('selectPage', function (event, page) {
//      console.log($scope.page)
      loadRecords({page: page})
//      setTimeout(function () {
//        console.log($scope.page)
//      }, 100)
    });

    $scope.addDocument = function () {
      var modalInstance = $modal.open({
        templateUrl: 'addDocumentModal.html',
        controller: 'AddDocumentModalCtrl',
        windowClass: 'add-document-modal'
      })
      modalInstance.result.then(function (response) {
        $route.reload()
        console.log(response)
      }, function () {
//        console.log('Modal dismissed at: ' + new Date());
      });
    }

    $scope.toggleOperation = function () {
      $scope.isMore = !$scope.isMore
    }

    $scope.query = function () {
      $scope.page = 5
      loadRecords()
    }


  }])