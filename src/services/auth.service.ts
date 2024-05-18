import userModel, {User} from '../models/user.model';
import CustomException from "../utils/exceptions/custom.exception";
import {generateToken} from '../utils/helpers/jwt';
import {DocumentType} from "@typegoose/typegoose";
import bcrypt from "bcryptjs";

export const createUser = async (payload: User) => {
    const {firstname, lastname, email, password} = payload;

    const emailExists = await getUserByEmail(email);

    if (emailExists) {
        throw new CustomException('Email already in use by another user.');
    }

    return await userModel.create({firstname, lastname, email, password});
}

export const getUserByEmail = async (email: string) => {
    return userModel.findOne({email});
}

export const loginUser = async (email: string, password: string) => {
    const user = await getUserByEmail(email);

    if (!user) {
        throw new CustomException('User does not exist. Kindly create a new account.');
    }

    const result = bcrypt.compareSync(password, user.password);

    if (!result) {
        throw new CustomException('Incorrect login details');
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

