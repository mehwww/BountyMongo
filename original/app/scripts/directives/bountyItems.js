bountyMongo.directive('bountyItems', [function () {
  return{
    restrict: 'AE',
    templateUrl: '/partials/bountyItems.html',
    transclude: true,
    link: function (scope, element, attrs) {
      var itemsName = [];
      scope.newItemName = '';

      scope.removeItem = function (index) {
        itemsName.splice(itemsName.indexOf(scope.items[index].name), 1)
        scope.items.splice(index, 1);
      };

      scope.addItem = function () {
        if (itemsName.indexOf(scope.newItemName) === -1) {
          scope.items.push({
            name: scope.newItemName,
            value: 1
          })
          itemsName.push(scope.newItemName);
        }
        scope.newItemName = '';
      }
    }
  }
}])


