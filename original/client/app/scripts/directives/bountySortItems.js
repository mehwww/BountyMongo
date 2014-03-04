bountyMongo.directive('bountySortItems', [
  function () {
    return{
      restrict: 'E',
      scope: {
        sort: '='
      },
      templateUrl: '/partials/bountySortItems.html',
      replace: true,
      link: function (scope, element, attrs) {
        scope.sort = []
        var sort = scope.sort
        var sortNames = []
        var newSortItem;

        sort.push({
          name: '_id',
          order: 1
        })

        scope.changeOrder = function (index) {
          sort[index].order = 0 - sort[index].order
        }

        scope.removeSortItem = function (index) {
          sortNames.splice(sortNames.indexOf(sort[index].name),1)
          sort.splice(index, 1);
        };

        scope.addSortItem = function () {
          if(sortNames.indexOf(scope.newSortItemName) === -1){
            sort.push({
              name:scope.newSortItemName,
              order:1
            })
            sortNames.push(scope.newSortItemName);
          }
        }

        scope.$watch('sort', function (newValue, oldValue) {
          console.log(newValue)
        },true);

      }
    }
  }
])