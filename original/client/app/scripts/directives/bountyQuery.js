bountyMongo.directive('bountyQuery', [
  function () {
    return{
      restrict: 'E',
      scope: {
        query: '='
      },
      templateUrl: '/partials/bountyQuery.html',
      replace: true,
      //have to use controller rather than link caz ace editor
      controller: ['$scope', function ($scope) {
        $scope.query = ''


        var aceLoad = function (_editor) {
          var _session = _editor.getSession();
          _session.setTabSize(2);
//          _session.on("change", function (e) {
//            $scope.query = _session.getValue()
//          });
        }

        $scope.aceOption = {
          useWrapMode: false,
          mode: 'json',
          onLoad: aceLoad
        }

//        $scope.$watch('query', function (newValue, oldValue) {
//          console.log(newValue)
//        });
      }]
    }
  }
])