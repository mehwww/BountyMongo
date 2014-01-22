bountyMongo.directive('records', ['bucket', function (bucket) {
  return{
    restrict:'E',
    scope:{
      records:'='
    },
    templateUrl: './partials/records.html'
  }
}]);