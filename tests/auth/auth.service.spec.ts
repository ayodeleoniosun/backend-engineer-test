import {login, register} from '../../src/services/auth.service';
import {connectToDB} from "../../src/config/database";
import UserModel from "../../src/models/user.model";
import {fakeData, testData} from '../seed/user.test';
import {ErrorMessages} from "../../src/utils/enums/error.messages";

beforeAll(async () => {
    process.env.NODE_ENV = 'testing';
    await connectToDB();
});

beforeEach(async () => {
    await UserModel.deleteMany({});
    await register(testData);
});

describe('Register User', () => {
    it('should throw an error if email already exist', async () => {
        try {
            await register(testData);
        } catch (err: any) {
            expect(err.message).toBe(ErrorMessages.USER_ALREADY_EXISTS);
        }
    });

    it('can create new user', async () => {
        const response = await register(fakeData);

        expect(response.firstname).toBe(fakeData.firstname);
        expect(response.lastname).toBe(fakeData.lastname);
        expect(response.email).toBe(fakeData.email);
    });
});

describe('Login User', () => {
    it('should throw an error if email does not exist', async () => {
        try {
            await login('invalidEmail@email.com', 'password');
        } catch (err: any) {
            expect(err.message).toBe(ErrorMessages.USER_NOT_FOUND);
        }
    });

    it('should throw an error if login credentials are invalid', async () => {
        try {
            await login(testData.email, 'password');
        } catch (err: any) {
            expect(err.message).toBe(ErrorMessages.INCORRECT_LOGIN_CREDENTIALS);
        }
    });

    it('should login if correct credentials are supplied', async () => {
        const response = await login(testData.email, testData.password);
        
        expect(response).toHaveProperty('token');
        expect(response!.user!.firstname).toEqual(testData.firstname);
        expect(response!.user!.lastname).toEqual(testData.lastname);
        expect(response!.user!.email).toEqual(testData.email);
    });
});