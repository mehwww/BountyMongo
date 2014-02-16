bountyMongo.controller('SidebarCtrl', [

  '$scope',
  'records',
  'server',
  'database',

  function ($scope, records, server, database) {

    server().list().then(function (response) {
      $scope.serverList = _.map(response, function (value, key) {
//        return {name: key, dbName: value}
        return key;
      });
      $scope.server = $scope.serverList[0];
//      console.log($scope.serverList)
    })

    $scope.$watch('server', function (newVal) {
      if (newVal !== undefined) {
//        console.log(newVal)
        database(newVal).list().then(function (response) {
          if (_.isArray(response)) {
            $scope.databaseList = response;
          }
          else{
            $scope.databaseList = [{
              name:response.db
            }]
          }
        }, function (response) {
          console.log('failed request!!!', response)
          $scope.databaseList = null;
        });
      }
    })


//    $scope.$watch('server', function (newVal) {
//      records.server(newVal);
//      records.database('');
//      records.collection('');
//
//
//      server(newVal).query().then(function (response) {
//        $scope.databaseList = response.databases;
//      },function(response){
//        console.log('failed request!!!',response)
//      });
//    });
  }])