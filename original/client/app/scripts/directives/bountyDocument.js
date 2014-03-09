bountyMongo.directive('bountyDocument', [
  'jsonFilter',
  'collection',
  function (jsonFilter, collection) {
    return {
      restrict: 'AE',
      templateUrl: '/partials/bountyDocument.html',
      link: function (scope, element, attr) {
        scope.documentModel = {}
        scope.delete = function (index) {
          scope.records.splice(index, 1)
          collection(scope.serverName, scope.databaseName, scope.collectionName)
            .delete({q: {_id: scope.document._id}})
            .then(function (data) {
              console.log(data)
            }, function (data) {
              console.log(data)
            })
        }

        scope.aceOption = {
          useWrapMode: false,
          mode: 'json',
          onLoad: function (_editor) {
            var _session = _editor.getSession();
            _session.setTabSize(2);
          }
        }

        scope.isEditing = false
        scope.edit = function () {
          scope.documentModel.string = scope.document
          delete  scope.documentModel.string.$$hashKey
          scope.documentModel.string = jsonFilter(scope.document)
          scope.isEditing = true
        };

        scope.save = function () {
          try {
            var hashKey = scope.document.$$hashKey
            var id = scope.document._id
            var doc = JSON.parse(scope.documentModel.string)
            collection(scope.serverName, scope.databaseName, scope.collectionName)
              .update(doc,{q: {_id: id}})
              .then(function (data) {
                console.log(data)
                scope.document = doc
                scope.document.$$hashKey = hashKey
                scope.isEditing = false
              }, function (data) {
                console.log(data)
              })
          }
          catch (e) {
            console.log(e)
            console.log('Invaild json')
          }
        }

        scope.$watch('documentModel.string', function (newValue, oldValue) {
          console.log(newValue)
        });

        scope.cancel = function () {
          scope.isEditing = false
        };
      }
    }
  }])