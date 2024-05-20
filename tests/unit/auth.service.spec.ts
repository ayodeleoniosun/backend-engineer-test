import {login, register} from '../../src/services/auth.service';
import {closeDB, connectToDB} from "../../src/config/database";
import UserModel from "../../src/models/user.model";
import {registerPayload} from '../examples/user.test.payload';
import {ErrorMessages} from "../../src/utils/enums/error.messages";
import ProductModel from "../../src/models/product.model";
import {faker} from "@faker-js/faker";

describe('Authentication unit tests', () => {
    beforeAll(async () => {
        process.env.NODE_ENV = 'testing';
        await connectToDB();
    });

    beforeEach(async () => {
        await UserModel.deleteMany({});
        await register(registerPayload);
    });

    afterAll(async () => {
        await UserModel.deleteMany({});
        await ProductModel.deleteMany({});
        await closeDB();
    });

    describe('Registration', () => {
        it('it should throw an error if email already exist during registration', async () => {
            try {
                await register(registerPayload);
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.USER_ALREADY_EXISTS);
            }
        });

        it('it can create new user', async () => {
            let payload = JSON.parse(JSON.stringify(registerPayload));
            payload.email = faker.internet.email();

            const response = await register(payload);

            expect(response.firstname).toBe(payload.firstname);
            expect(response.lastname).toBe(payload.lastname);
            expect(response.email).toBe(payload.email);
        });
    });

    describe('Login', () => {
        it('it should throw an error if user does not exist during login', async () => {
            try {
                const payload = {email: 'invalidEmail@email.com', password: 'password'};
                await login(payload);
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.USER_NOT_FOUND);
            }
        });

        it('it should throw an error if login credentials are invalid', async () => {
            try {
                const payload = {email: registerPayload.email, password: 'password'};
                await login(payload);
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.INCORRECT_LOGIN_CREDENTIALS);
            }
        });

        it('it should login if correct credentials are supplied', async () => {
            const payload = {email: registerPayload.email, password: registerPayload.password};
            const response = await login(payload);

            expect(response).toHaveProperty('token');
            expect(response!.user!.firstname).toEqual(registerPayload.firstname);
            expect(response!.user!.lastname).toEqual(registerPayload.lastname);
            expect(response!.user!.email).toEqual(registerPayload.email);
        });
    });
});