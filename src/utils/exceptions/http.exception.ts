import {StatusCodesEnum} from "../enums/status.codes.enum";

class HttpException extends Error {
    message: string;
    statusCode: number;

    constructor(message: string, statusCode: number = StatusCodesEnum.BAD_REQUEST) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}

export default HttpException;