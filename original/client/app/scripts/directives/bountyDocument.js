bountyMongo.directive('bountyDocument', [
  'collection',
  function (collection) {
    return {
      restrict: 'AE',
      templateUrl: '/partials/bountyDocument.html',
      link: function (scope, element, attr) {
        scope.deleteDocument = function (index) {
//          console.log(index)
//          console.log(scope.document._id)
          scope.records.splice(index, 1)

          collection(scope.serverName, scope.databaseName, scope.collectionName)
            .delete({q: {_id: scope.document._id}})
            .then(function (data) {
              console.log(data)
            }, function (data) {
              console.log(data)
            })
        }
      }
    }
  }])