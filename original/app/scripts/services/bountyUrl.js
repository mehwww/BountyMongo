bountyMongo.factory('bountyUrl', [function () {
  var apiUrl = '/api';
  var urlFactory = function (params, query) {
    var params = params || [];
    var url = '';
    var paramsName = ['/servers/', '/databases/', '/collections/'];

    for (var i = 0; i < 3; i++) {
      url += params[i]
        ? paramsName[i] + encodeURIComponent(params[i])
        : ''
    }
    url += params[3] ? params[3] : ''

    if (query === undefined) return url;

    var query = query || {};
    url = url + '?';
    angular.forEach(query, function (value, key) {
      var value = angular.isObject(value) ? JSON.stringify(value) : value
      if (value !== '{}') url += key + '=' + value + '&';
    })
    return url.slice(0, -1);
  }

  var mongodbUrl = {
    parse: function (mongodbUrl) {
      var connectionPart = '';
      var authPart = '';
      var queryStringPart = '';

      var username = '';
      var password = '';

      var serverName = '';

      if (mongodbUrl.indexOf("?") != -1) {
        connectionPart = mongodbUrl.split("?")[0];
        queryStringPart = mongodbUrl.split("?")[1];
      }
      else {
        connectionPart = mongodbUrl;
      }

      if (connectionPart.indexOf("@") != -1) {
        authPart = connectionPart.split("@")[0];
        connectionPart = connectionPart.split("@")[1];

        username = authPart.split(":")[0];
        password = authPart.split(":")[1];

        serverName = username + '@' + connectionPart;
      }
      else {
        serverName = mongodbUrl;
      }

      return {
        name: serverName,
        url: mongodbUrl
      }
    }
  }


  return{
    url: function (params, query) {
      return urlFactory(params, query)
    },
    apiUrl: function (params, query) {
      return apiUrl + urlFactory(params, query)
    },
    mongodbUrl:mongodbUrl
  }
}])