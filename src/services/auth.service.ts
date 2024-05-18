import userModel, {User} from '../models/user.model';
import HttpException from "../utils/exceptions/http.exception";
import {generateToken} from '../utils/helpers/jwt';
import {DocumentType} from "@typegoose/typegoose";
import bcrypt from "bcryptjs";
import {ErrorMessages} from '../utils/enums/error.messages';

export const register = async (payload: User) => {
    const {firstname, lastname, email, password} = payload;

    const emailExists = await getUserByEmail(email);

    if (emailExists) {
        throw new HttpException(ErrorMessages.USER_ALREADY_EXISTS);
    }

    return await userModel.create({firstname, lastname, email, password});
}

export const getUserByEmail = async (email: string) => {
    return userModel.findOne({email});
}

export const login = async (email: string, password: string) => {
    const user = await getUserByEmail(email);

    if (!user) {
        throw new HttpException(ErrorMessages.USER_NOT_FOUND);
    }

    const result = bcrypt.compareSync(password, user.password);

    if (!result) {
        throw new HttpException(ErrorMessages.INCORRECT_LOGIN_CREDENTIALS);
    }

    const token = await generateToken(user);

    if (token) {
        return {
            token,
            user: await getUserData(user),
        };
    }
}

export const getUserData = async (user: DocumentType<User>) => {
    const {_id, firstname, lastname, email, createdAt} = user;

    return {_id, firstname, lastname, email, createdAt};
}

