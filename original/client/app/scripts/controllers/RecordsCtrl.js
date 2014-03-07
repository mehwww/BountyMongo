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
    var serverName = $routeParams.serverName;
    var databaseName = $routeParams.databaseName;
    var collectionName = $routeParams.collectionName;

    self.loadRecords = function (options) {
      var options = options || {};
      collection(serverName, databaseName, collectionName)
        .query({
          p: options.page || $scope.page,
          l: options.pageSize || $scope.pageSize,
          q: JSON.stringify(options.query || $scope.query),
          s: JSON.stringify(options.sort || $scope.sort),
          f: JSON.stringify(options.fields || $scope.fields)
        })
        .then(function (response) {
          $scope.records = response
        }, function (response) {
          console.log('Get Records Fail', response)
        })

      collection(serverName, databaseName, collectionName).count({
        q: JSON.stringify(options.query || $scope.query),
      }).then(function (response) {
        $scope.count = response.count;
      }, function (response) {
        console.log('count fail', response)
      })
    }

    self.toObj = function(array,obj){
      angular.forEach(array, function (item) {
        this[item.name] = item.value
      }, obj)
    }

    $scope.page = 1;
    $scope.pageSize = 20;
    $scope.query = {};
    $scope.sort = {};
    $scope.fields = {};

    $scope.queryStr = {string:''};
    $scope.sortArray = [];
    $scope.fieldsArray = [];

    $scope.$watch('query', function (newValue, oldValue) {
      console.log(newValue)
    },true);
    
    
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
      self.toObj($scope.sortArray,$scope.sort)

      $scope.fields = {};
      self.toObj($scope.fieldsArray,$scope.fields)

      $scope.query = {}
      if($scope.queryStr.string.length !== 0){
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