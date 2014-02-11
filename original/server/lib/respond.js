module.exports = function (err, result) {
  if (err) {
    return {
      ok: 0,
      errmsg: err.toString()
    };
  }
  else {
    return result;
  }

//	if (err) {
//		return {
//			status: "error",
//			error: err
//		};
//	}
//	return {
//		status: "ok",
//		data: data
//	};
}