import {login, register} from '../../src/services/auth.service';
import {connectToDB} from "../../src/config/database";
import UserModel from "../../src/models/user.model";
import {fakeData, testData} from '../seed/user.test';
import {ErrorMessages} from "../../src/utils/enums/error.messages";
import ProductModel from "../../src/models/product.model";

describe('Authentication unit tests', () => {
    beforeAll(async () => {
        process.env.NODE_ENV = 'testing';
        await connectToDB();
    });

    beforeEach(async () => {
        await UserModel.deleteMany({});
        await register(testData);
    });

    afterAll(async () => {
        await UserModel.deleteMany({});
        await ProductModel.deleteMany({});
    });

    describe('Registration', () => {
        it('it should throw an error if email already exist during registration', async () => {
            try {
                await register(testData);
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.USER_ALREADY_EXISTS);
            }
        });

        it('it can create new user', async () => {
            const response = await register(fakeData);

            expect(response.firstname).toBe(fakeData.firstname);
            expect(response.lastname).toBe(fakeData.lastname);
            expect(response.email).toBe(fakeData.email);
        });
    });


    describe('Login', () => {
        it('it should throw an error if user does not exist during login', async () => {
            try {
                await login('invalidEmail@email.com', 'password');
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.USER_NOT_FOUND);
            }
        });

        it('it should throw an error if login credentials are invalid', async () => {
            try {
                await login(testData.email, 'password');
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.INCORRECT_LOGIN_CREDENTIALS);
            }
        });

        it('it should login if correct credentials are supplied', async () => {
            const response = await login(testData.email, testData.password);

            expect(response).toHaveProperty('token');
            expect(response!.user!.firstname).toEqual(testData.firstname);
            expect(response!.user!.lastname).toEqual(testData.lastname);
            expect(response!.user!.email).toEqual(testData.email);
        });
    });
});