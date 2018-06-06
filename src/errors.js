/* Resolver errors.
 */
import {
    BAD_REQUEST,
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    UNPROCESSABLE_ENTITY,
    GATEWAY_TIMEOUT,
} from 'http-status-codes';


export class APIError extends Error {
    constructor(message, code) {
        super(message);
        Error.captureStackTrace(this, this.constructor);

        this.code = code;
        this.extensions = {
            code: `HTTP-${this.code}`,
        };
    }
}

export class BadRequest extends APIError {
    constructor(message = 'Bad Request') {
        super(message, BAD_REQUEST);
    }
}

export class Forbidden extends APIError {
    constructor(message = 'Forbidden') {
        super(message, FORBIDDEN);
    }
}

export class InternalServerError extends APIError {
    constructor(message = 'Internal Server Error') {
        super(message, INTERNAL_SERVER_ERROR);
    }
}

export class NotFound extends APIError {
    constructor(message = 'Not Found') {
        super(message, NOT_FOUND);
    }
}

export class UnprocessableEntity extends APIError {
    constructor(message = 'Unprocessable Entity') {
        super(message, UNPROCESSABLE_ENTITY);
    }
}


export class TooManyResults extends APIError {
    constructor(message = 'Too Many Results') {
        super(message, INTERNAL_SERVER_ERROR);
    }
}


export class NoResults extends APIError {
    constructor(message = 'No Results') {
        super(message, NOT_FOUND);
    }
}


export class MaxLimitReached extends APIError {
    constructor(message = 'Max Limit Reached') {
        super(message, GATEWAY_TIMEOUT);
    }
}
