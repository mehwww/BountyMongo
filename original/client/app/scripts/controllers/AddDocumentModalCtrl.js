bountyMongo.controller('AddDocumentModalCtrl', [

  '$scope',
  '$routeParams',
  '$modalInstance',
  'collection',

  function ($scope, $routeParams, $modalInstance, collection) {
    var serverName = $routeParams.serverName;
    var databaseName = $routeParams.databaseName;
    var collectionName = $routeParams.collectionName;

    $scope.aceLoad = function (_editor) {
      var _session = _editor.getSession();
      _session.setTabSize(2);
      _session.on("change", function (e) {
        $scope.document = _session.getValue()
      });
    }

    $scope.aceOption = {
      useWrapMode: false,
      mode: 'json',
      onLoad: $scope.aceLoad
    }

    $scope.$watch('document', function (newVal) {
      console.log(newVal)
    })

    $scope.add = function () {
      var document = {};
      try {
        document = JSON.parse($scope.document)
        console.log(document);
        collection(serverName, databaseName, collectionName).add(document).then(function (response) {
          $modalInstance.close(response)
        }, function (response) {
          console.log(response.data)
        })
      }
      catch (e) {
        console.log('Invaild JSON')
      }
    }

    $scope.cancel = function(){
      $modalInstance.dismiss();
    }

  }
])
