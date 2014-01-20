bountyMongo.directive('database', [function () {
  return {
    restrict:'E',
    scope:{
      databaseList:'=',
      selectedDatabase:'='
    },
    templateUrl:'./partials/database.html',
    replace:true,
//    controller:['$scope',function(){
//      var self = this;
//      this.collections = [];
//      this.closeOthers = function(selectedCollection){
//        angular.forEach(self.collections,function(collection){
//          if(collection !== selectedCollection){
//            collection.isSelected = false;
//          }
//        });
//      };
//      this.addCollection = function(collectionScope){
//        self.collections.push(collectionScope);
//        collectionScope.$on('$destroy',function(){
//          self.removeCollection(collectionScope)
//        })
//      }
//      this.removeCollection = function(collection){
//        var index = self.collections.indexOf(collection);
//        if(index !== -1){
//          this.collections.splice(index, 1);
//        }
//      }
//    }],
    link:function(scope,element,attrs){
      scope.select = function(){

      }
    }
  }

}])