bountyMongo.controller('sidebar', [

    '$scope',
    '$q',
    'config',
    'server',
    'database',
    'collection',

    function ($scope, $q, config, server,database,collection) {
        $scope.serversList = config.serverConfig.list;
        $scope.selectedServer = $scope.serversList[0];

        $scope.$watch('selectedServer', function () {
            config.serverConfig.selectServer($scope.selectedServer);
            server().query().then(function (response) {
                $scope.databases = response;//test use
                $scope.databasesList = response;
                $scope.selectedDatabase = null;
                $scope.collections = [];
            });
        });

        $scope.$watch('selectedDatabase',function(){
            config.databaseConfig.selectDatabase($scope.selectedDatabase);
            if(!$scope.selectedDatabase) return;
            database().query().then(function(response){
                $scope.collections = response;
                $scope.collectionsList = response;
            })
        });

        $scope.$watch('selectedCollection',function(){
            config.collectionConfig.selectCollection($scope.selectedCollection);
            if(!$scope.selectedCollection) return;
            collection().query().then(function(response){
                $scope.documents = response;
            })
        })

//        $scope.ngCity = 'asdf';

//    $scope.$watch('selectedDatabase', function (newValue, oldValue) {
//        if (!newValue) return;
//        databasesResource($scope.selectedServer.host, $scope.selectedDatabase.name).query().then(function (res) {
//            $scope.collectionsList = res.data.collectionNames
//            $scope.database = res;
//        });
//    });


//    databasesResource();
    }])