import request from 'supertest';
import {app} from '../../src/app';
import * as HttpStatus from 'http-status';
import {ResponseStatus} from "../../src/dtos/responses/response.interface";
import {SuccessMessages} from "../../src/utils/enums/success.messages";

describe('Index page', () => {
    it('should render welcome message', async () => {
        const response = await request(app).get('').set('Accept', 'application/json');
        const data = JSON.parse(response.text);

        expect(response.status).toBe(HttpStatus.OK);
        expect(data.status).toBe(ResponseStatus.SUCCESS);
        expect(data.message).toBe(SuccessMessages.WELCOME);
    });
});