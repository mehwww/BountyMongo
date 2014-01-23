bountyMongo.directive('bmRecords', ['bucket', 'collection', function (bucket, collection) {
  return{
    restrict: 'E',
    scope: {
      records: '='
    },
    templateUrl: './partials/bmRecords.html',
    link: function (scope, element, attrs) {

    }
  }
}]);