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
      url += key + '=' + value + '&'
    })
    return url.slice(0, -1);
//
//    url+=query.q
//      ?'q='+query.q + '&'
//      :''
//    if (queryOptions.q)url = url + 'q=' + queryOptions.q + '&';
//    if (queryOptions.p)url = url + 'p=' + queryOptions.p + '&';
//    if (queryOptions.l)url = url + 'l=' + queryOptions.l + '&';
//    if (queryOptions.s)url = url + 's=' + queryOptions.s + '&';
  }
}])