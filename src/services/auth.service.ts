import HttpException from "../utils/exceptions/http.exception";
import {generateToken} from '../utils/helpers/jwt';
import {ErrorMessages} from '../utils/enums/error.messages';
import {SignupDto} from "../dtos/requests/signup.dto";
import {UserModelDto} from "../dtos/models/user.model.dto";
import {LoginDto} from "../dtos/requests/login.dto";
import * as HttpStatus from 'http-status';
import {AuthRepository} from "../repositories/auth.repository";
import {Service} from "typedi";
import {comparePassword} from "../utils/helpers/password_hash";

@Service()
export class AuthService {
    public constructor(private authRepository: AuthRepository) {
    }

    async register(payload: SignupDto): Promise<UserModelDto> {
        const {firstname, lastname, email, password} = payload;

        const emailExists = await this.authRepository.getUserByEmail(email);

        if (emailExists) {
            throw new HttpException(ErrorMessages.USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
        }

        const {_id, createdAt} = await this.authRepository.create({firstname, lastname, email, password});

        return new UserModelDto(_id, firstname, lastname, email, createdAt);
    }

    async login(payload: LoginDto) {
        const {email, password} = payload;

        const [user] = await Promise.all([this.authRepository.getUserByEmail(email)]);

        if (!user) {
            throw new HttpException(ErrorMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const result = comparePassword(password, user.password);

        if (!result) {
            throw new HttpException(ErrorMessages.INCORRECT_LOGIN_CREDENTIALS);
        }

        const token = await generateToken(user);

        if (token) {
            return {
                token,
                user: new UserModelDto(user._id, user.firstname, user.lastname, user.email, user.createdAt),
            };
        }
    }
}
