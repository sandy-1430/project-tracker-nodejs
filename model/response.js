exports.success = (res, data) => {
    return res.status(200).json({
        status: "Success",
        data: data
    });
}

exports.ErrorResponse = (res, statusCode, message, error) => {
    return res.status(statusCode).json({
        status: "Request Failed",
        message: message,
        data: error.message
    });
}