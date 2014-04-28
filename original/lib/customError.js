var getCustomError = function(errorName){

  var customError = function (msg) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.errmsg = msg;
    this.ok = 0;
    this.name = errorName;
  }
  customError.prototype.__proto__ = Error.prototype;

  return customError;
}




//function MongoError (msg) {
//  Error.call(this);
//  Error.captureStackTrace(this, arguments.callee);
//  this.errmsg = msg;
//  this.ok = 0;
//  this.name = 'MongoError';
//};
//
//MongoError.prototype.__proto__ = Error.prototype;
//
//function BountyError (msg) {
//  Error.call(this);
//  Error.captureStackTrace(this, arguments.callee);
//  this.name = 'BountyError';
//  this.ok =0;
//  this.errmsg = msg;
//};
//
//BountyError.prototype.__proto__ = Error.prototype;



exports.mongoError = getCustomError('MongoError');
exports.bountyError = getCustomError('BountyError');