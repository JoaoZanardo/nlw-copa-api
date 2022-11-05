import httpStatusCode from 'http-status-codes';

interface APIError {
    code: number;
    message: string
    error?: string;
}

export default class ApiError {
    static format(error: APIError): APIError {
        return {
            code: error.code,
            message: error.message,
            error: error.error ? error.error : httpStatusCode.getStatusText(error.code)
        };
    }
}