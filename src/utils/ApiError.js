//creating a custom error class by extending the built-in Error object

class ApiError extends Error {
    constructor(
        statuscode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){//overriding
        super(message)
        this.statuscode = statuscode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}