bountyMongo.filter('fields', [function () {
  return function (input) {
    if (input === 1)return 'Include'
    if (input === 0)return 'Exclude'
    return null
  }
}]);
