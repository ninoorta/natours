class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        // message is the only built-in method Error class accepts.
        // and by doing this, the message property of this class will be set by the incoming message.   

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);    // this function will make what error from AppError
        // will not enter the error stack

    }
}

module.exports = AppError;