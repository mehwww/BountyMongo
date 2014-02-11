module.exports = function (err, result, res) {
  if (err) {
    res.send({
      ok: 0,
      errmsg: err.toString()
    });
  }
  else {
    res.send(result);
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