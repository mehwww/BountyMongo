/*
function error(errInfo) {
	return {
		status: "error",
		err: errInfo
	}
}

function success(successData) {
	return {
		status: "ok",
		data: successData
	}
}*/


module.exports = function(err, data) {
	if (err) {
		return {
			status: "error",
			error: err
		};
	}
	return {
		status: "ok",
		data: data
	};
}