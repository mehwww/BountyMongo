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
      var options = options || {};
      collection(serverName, databaseName, collectionName)
        .query({
          p: options.page || $scope.page,
          l: options.pageSize || $scope.pageSize,
          s: JSON.stringify(options.sort || $scope.sort)
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
    $scope.pageSize = 20;
    $scope.sort = {};


    loadRecords()

    $scope.$on('selectPage', function (event, page) {
      event.stopPropagation()
      loadRecords({page: page})
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
      angular.forEach($scope.sortArray, function (sortItem) {
        this[sortItem.name] = sortItem.order
      }, $scope.sort)
      $scope.page = 1
      loadRecords()
    }

  }])