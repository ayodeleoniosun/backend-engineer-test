import {AuthService} from '../../src/services/auth.service';
import {ErrorMessages} from "../../src/utils/enums/error.messages";
import {faker} from "@faker-js/faker";
import {AuthRepository} from "../../src/repositories/auth.repository";
import {getUser} from "../fixtures/user.fixture";
import {SignupDto} from "../../src/dtos/requests/signup.dto";
import {UserModelDto} from "../../src/dtos/models/user.model.dto";
import {LoginDto} from "../../src/dtos/requests/login.dto";

describe('Authentication unit tests', () => {
    let authRepository: AuthRepository;
    let service: AuthService;

    beforeAll(async () => {
        authRepository = new AuthRepository();
        service = new AuthService(authRepository);
    });

    let getUserByEmail: jest.SpyInstance;
    let createUserMock: jest.SpyInstance;

    beforeEach(() => {
        getUserByEmail = jest.spyOn(authRepository, 'getUserByEmail');
        createUserMock = jest.spyOn(authRepository, 'create');
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('Registration', () => {
        it('it should throw an error if email already exist during registration', async () => {
            const mockUserData = getUser();
            getUserByEmail.mockResolvedValue(mockUserData);

            const payload = new SignupDto();
            payload.firstname = faker.internet.displayName();
            payload.lastname = faker.internet.displayName();
            payload.email = faker.internet.email();
            payload.password = 'JohnDoe@2024';
            payload.password_confirmation = 'JohnDoe@2024';

            try {
                await service.register(payload);
            } catch (e: any) {
                expect(getUserByEmail).toBeCalledTimes(1);
                expect(createUserMock).toBeCalledTimes(0);
                expect(e.message).toBe(ErrorMessages.USER_ALREADY_EXISTS);
            }
        });

        it('it can create new user', async () => {
            const mockUserData = getUser();
            getUserByEmail.mockResolvedValue(null);
            createUserMock.mockResolvedValue(mockUserData);

            const payload = new SignupDto();
            payload.firstname = mockUserData.firstname;
            payload.lastname = mockUserData.lastname;
            payload.email = mockUserData.email;
            payload.password = 'JohnDoe@2024';
            payload.password_confirmation = 'JohnDoe@2024';

            const registeredUser = await service.register(payload);
            expect(registeredUser).toBeInstanceOf(UserModelDto);
            expect(registeredUser).toHaveProperty('id', mockUserData._id);
            expect(registeredUser).toHaveProperty('email', mockUserData.email);
        });
    });

    describe('Login', () => {
        it('it should throw an error if user does not exist during login', async () => {
            getUserByEmail.mockResolvedValue(null);

            const payload = new LoginDto();
            payload.email = faker.internet.email();
            payload.password = 'JohnDoe@2024';

            try {
                await service.login(payload);
            } catch (e: any) {
                expect(e.message).toBe(ErrorMessages.USER_NOT_FOUND);
            }
        });

        it('it should throw an error if login credentials are invalid', async () => {
            const mockUserData = getUser();
            getUserByEmail.mockResolvedValue(mockUserData);

            const payload = new LoginDto();
            payload.email = mockUserData.email;
            payload.password = 'IncorrectPassword';

            try {
                await service.login(payload);
            } catch (e: any) {
                expect(e.message).toBe(ErrorMessages.INCORRECT_LOGIN_CREDENTIALS);
            }
        });

        it('it should login if correct credentials are supplied', async () => {
            const mockUserData = getUser();
            getUserByEmail.mockResolvedValue(mockUserData);

            const payload = new LoginDto();
            payload.email = mockUserData.email;
            payload.password = 'JohnDoe@2024';

            const loggedInUser = await service.login(payload);
            const response = JSON.parse(JSON.stringify(loggedInUser));
            expect(loggedInUser).toBeInstanceOf(Object);
            expect(loggedInUser).toHaveProperty('token');
            expect(response.user.email).toBe(payload.email);
        });
    });
});