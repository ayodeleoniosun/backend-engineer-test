import {connectToDB} from "../../src/config/database";
import UserModel from "../../src/models/user.model";
import request from "supertest";
import {app} from '../../src/app';
import {registrationData} from "../seed/user.test";
import {SuccessMessages} from "../../src/utils/enums/success.messages";
import {ErrorMessages} from "../../src/utils/enums/error.messages";
import ProductModel from "../../src/models/product.model";
import {StatusCodesEnum} from "../../src/utils/enums/status.codes.enum";

describe('Authentication end-to-end testing', () => {
    beforeAll(async () => {
        process.env.NODE_ENV = 'testing';
        await connectToDB();
    });

    beforeEach(async () => {
        await UserModel.deleteMany({});
    });

    afterAll(async () => {
        await UserModel.deleteMany({});
        await ProductModel.deleteMany({});
    });

    const baseUrl = '/api/auth';

    describe('POST: /api/auth/register', () => {
        it('it cannot create new user if firstname is less than specified characters', async () => {
            let payload = JSON.parse(JSON.stringify(registrationData));
            payload.firstname = 'fi';

            const response = await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.UNPROCESSABLE_ENTITY);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.FIRSTNAME_MIN_LEGNTH_ERROR);
        });

        it('it cannot create new user if invalid email is supplied', async () => {
            let payload = JSON.parse(JSON.stringify(registrationData));
            payload.email = 'invalidEmail';

            const response = await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.UNPROCESSABLE_ENTITY);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.INVALID_EMAIL_SUPPLIED);
        });

        it('it cannot create new user if password has less than 8 characters', async () => {
            let payload = JSON.parse(JSON.stringify(registrationData));
            payload.password = '123456';

            const response = await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.UNPROCESSABLE_ENTITY);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.PASSWORD_MIN_LEGNTH_ERROR);
        });

        it('it cannot create new user if passwords do not match', async () => {
            let payload = JSON.parse(JSON.stringify(registrationData));
            payload.password_confirmation = '123456';

            const response = await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.UNPROCESSABLE_ENTITY);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.PASSWORDS_DO_NOT_MATCH);
        });

        it('it should throw an error if email already exist during registration', async () => {
            await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(registrationData);

            const response = await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(registrationData);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.BAD_REQUEST);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.USER_ALREADY_EXISTS);
        });

        it('it can create new user', async () => {
            const response = await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(registrationData);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.CREATED);
            expect(data.success).toBeTruthy();
            expect(data.message).toBe(SuccessMessages.REGISTRATION_SUCCESSFUL);
        });
    });


    describe('POST: /api/auth/login', () => {
        it('it should throw an error if user does not exist during login', async () => {
            const response = await request(app)
                .post(`${baseUrl}/login`)
                .set('Accept', 'application/json')
                .send(registrationData);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.BAD_REQUEST);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.USER_NOT_FOUND);
        });

        it('it should throw an error if login credentials are invalid', async () => {
            //register user first

            await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(registrationData);

            let payload = JSON.parse(JSON.stringify(registrationData));
            payload.password = '123456';

            //attempt to login

            const response = await request(app)
                .post(`${baseUrl}/login`)
                .set('Accept', 'application/json')
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.BAD_REQUEST);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.INCORRECT_LOGIN_CREDENTIALS);
        });

        it('it should login if correct credentials are supplied', async () => {
            await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(registrationData);

            const response = await request(app)
                .post(`${baseUrl}/login`)
                .set('Accept', 'application/json')
                .send(registrationData);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.OK);
            expect(data.success).toBeTruthy();
            expect(data.message).toBe(SuccessMessages.LOGIN_SUCCESSFUL);
        });
    });
});
