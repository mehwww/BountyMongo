module.exports = function (url) {
  var connectionPart = '';
  var authPart = '';
  var queryStringPart = '';
  var username = '';
  var password = '';
  var serverName = '';

  if (url.indexOf("mongodb://") != 0)return null;

  if (url.indexOf("?") != -1) {
    queryStringPart = url.substr(url.indexOf("?") + 1);
    connectionPart = url.substring("mongodb://".length, url.indexOf("?"))
  } else {
    connectionPart = url.substring("mongodb://".length);
  }

  if (connectionPart.indexOf("@") != -1) {
    authPart = connectionPart.split("@")[0];
    connectionPart = connectionPart.split("@")[1];

    username = authPart.split(":")[0];
    password = authPart.split(":")[1];

    serverName = username + '@' + connectionPart;
  }
  else {
    serverName = connectionPart;
  }

  return {
    name: serverName,
    url: url
  };
}