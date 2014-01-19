bountyMongo.directive('database', [function () {
  return {
    restrict:'E',
    scope:{
      databaseList:"="
    },
    templateUrl:'./partials/database.html',
    replace:true
  }

}])