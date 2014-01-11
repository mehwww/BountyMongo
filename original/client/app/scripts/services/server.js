bountyMongo.factory('server', [

    '$http',
    'config',

    function ($http, config) {
        return function () {
            var server = config.serverConfig.selected;
            var serverURL = config.serverURL;

            var url = serverURL + 'servers/' + server.host;
            var Resource = function (data) {
                angular.extend(this, data);
            };
            Resource.query = function () {
                return $http.get(url).then(function (response) {
                    //返回该服务器上的所有databases
                    return response.data.data.databases;
                });
            }
            return Resource;
        }
    }])
