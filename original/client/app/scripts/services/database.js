bountyMongo.factory('database', [

    '$http',
    'config',

    function ($http, config) {
        return function () {
            var database = config.databaseConfig.selected;
            var server = config.serverConfig.selected;
            var serverURL = config.serverURL;
            var url = serverURL + 'servers/' + server.host + '/databases/' + database.name;
            var Resource = function (data) {
                angular.extend(this, data);
            };
            Resource.query = function () {
                return $http.get(url).then(function (response) {
                    //返回该服务器上的所有collections
                    var collectionsList = [];
                    angular.forEach(response.data.data.collectionNames,function(value,key){
                        value.name = value.name.substr(value.name.indexOf('.')+1);
                        this.push(value);
                    },collectionsList)
                    return collectionsList;
                });
            }
            return Resource;
        }
    }])
