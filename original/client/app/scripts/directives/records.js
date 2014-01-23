bountyMongo.directive('records', ['bucket', 'collection', function (bucket, collection) {
  return{
    restrict: 'E',
    scope: {
      records: '='
    },
    templateUrl: './partials/records.html',
    link: function (scope, element, attrs) {

    }
  }
}]);