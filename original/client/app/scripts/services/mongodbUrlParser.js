bountyMongo.factory('mongodbUrlParser', [function () {
  return function (mongodbUrl) {
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
}])
