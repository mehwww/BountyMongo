bountyMongo.filter('sort', [function () {
  return function (input) {
    if(input===1)return 'AES'
    if(input===-1)return 'DESC'
    return null
  }
}]);

