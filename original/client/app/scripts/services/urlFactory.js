bountyMongo.factory('urlFactory', [function () {
  return function (params, query) {
    var params = params || [];
    var apiUrl = '/api';
    var url = apiUrl;
    var paramsName = ['/servers/', '/databases/', '/collections/'];

    for (var i = 0; i < 3; i++) {
      url += params[i]
        ? paramsName[i] + encodeURIComponent(params[i])
        : ''
    }
    url += params[3] ? params[3] : ''

    if (query === false) return url.slice(apiUrl.length)
    if (query === undefined) return url;

    var query = query || {};
    url = url + '?';
    angular.forEach(query, function (value, key) {
      var value = angular.isObject(value) ? JSON.stringify(value) : value
      if (value !== '{}') url += key + '=' + value + '&';
    })
    return url.slice(0, -1);
  }
}])