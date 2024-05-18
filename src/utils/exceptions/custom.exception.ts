import {StatusCodesEnum} from "../enums/status.codes.enum";

class CustomException {
    message: string;
    statusCode: number;

    constructor(message, statusCode = StatusCodesEnum.BAD_REQUEST) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

export  default CustomException;