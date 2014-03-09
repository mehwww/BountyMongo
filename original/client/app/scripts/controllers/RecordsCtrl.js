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
    var self = this;
    $scope.serverName = $routeParams.serverName;
    $scope.databaseName = $routeParams.databaseName;
    $scope.collectionName = $routeParams.collectionName;

    self.loadRecords = function (options) {
      var options = options || {};
      collection($scope.serverName, $scope.databaseName, $scope.collectionName)
        .query({
          p: options.page || $scope.page,
          l: options.pageSize || $scope.pageSize,
          q: options.query || $scope.query,
          s: options.sort || $scope.sort,
          f: options.fields || $scope.fields
        })
        .then(function (response) {
          $scope.records = response
        }, function (response) {
          console.log('Get Records Fail', response)
        })

      collection($scope.serverName, $scope.databaseName, $scope.collectionName).count({
        q: options.query || $scope.query
      }).then(function (response) {
          $scope.count = response.count;
        }, function (response) {
          console.log('count fail', response)
        })
    }

    self.toObj = function (array, obj) {
      angular.forEach(array, function (item) {
        this[item.name] = item.value
      }, obj)
    }

    $scope.page = 1;
    $scope.pageSize = 20;
    $scope.query = {};
    $scope.sort = {};
    $scope.fields = {};

    $scope.queryStr = {string: ''};
    $scope.sortArray = [];
    $scope.fieldsArray = [];

//    $scope.$watch('query', function (newValue, oldValue) {
//      console.log(newValue)
//    },true);

    self.loadRecords();

    $scope.$on('selectPage', function (event, page) {
      event.stopPropagation()
      self.loadRecords({page: page})
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


    $scope.find = function () {
      $scope.sort = {};
      self.toObj($scope.sortArray, $scope.sort)

      $scope.fields = {};
      self.toObj($scope.fieldsArray, $scope.fields)

      $scope.query = {}
      if ($scope.queryStr.string.length !== 0) {
        try {
          $scope.query = angular.fromJson($scope.queryStr.string)
        }
        catch (e) {
          console.log('Invaild query JSON');
        }
      }
      $scope.page = 1
      self.loadRecords()
    }

  }])