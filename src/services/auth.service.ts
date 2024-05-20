import userModel from '../models/user.model';
import HttpException from "../utils/exceptions/http.exception";
import {generateToken} from '../utils/helpers/jwt';
import bcrypt from "bcryptjs";
import {ErrorMessages} from '../utils/enums/error.messages';
import {RegisterPayloadDto} from "../dtos/authentication/register.payload.dto";
import {UserDto} from "../dtos/user.dto";
import {LoginPayloadDto} from "../dtos/authentication/login.payload.dto";
import * as HttpStatus from 'http-status';

export const register = async (payload: RegisterPayloadDto) => {
    const {firstname, lastname, email, password} = payload;

    const emailExists = await getUserByEmail(email);

    if (emailExists) {
        throw new HttpException(ErrorMessages.USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
    }

    const user = await userModel.create({firstname, lastname, email, password});

    return new UserDto(user._id, user.firstname, user.lastname, user.email, user.createdAt);
}

export const getUserByEmail = async (email: string) => {
    return userModel.findOne({email});
}

export const login = async (payload: LoginPayloadDto) => {
    const {email, password} = payload;

    const user = await getUserByEmail(email);

    if (!user) {
        throw new HttpException(ErrorMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const result = bcrypt.compareSync(password, user.password);

    if (!result) {
        throw new HttpException(ErrorMessages.INCORRECT_LOGIN_CREDENTIALS);
    }

    const token = await generateToken(user);

    if (token) {
        return {
            token,
            user: new UserDto(user._id, user.firstname, user.lastname, user.email, user.createdAt),
        };
    }
}
