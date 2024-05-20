import {IResponse, responseStatus} from "./response.interface";

export class ResponseDto implements IResponse {
    status: responseStatus;
    message: string;
    data: any;

    constructor(status: responseStatus, message: string, data: any = null) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}