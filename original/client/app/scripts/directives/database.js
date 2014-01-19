bountyMongo.directive('database', [function () {
  return {
    restrict:'E',
    scope:{
      databaseList:'=',
      selectedDatabase:'='
    },
    templateUrl:'./partials/database.html',
    replace:true
  }

}])