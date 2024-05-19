import {DocumentType} from "@typegoose/typegoose";
import {User} from "../../models/user.model";
import jwt from "jsonwebtoken";
import config from "../../config";
import crypto from "crypto";
import HttpException from "../exceptions/http.exception";
import {ErrorMessages} from "../enums/error.messages";
import {StatusCodesEnum} from "../enums/status.codes.enum";

export const generateToken = async (user: DocumentType<User>) => {
    return jwt.sign({id: user.id, email: user.email}, config.jwt_secret, {expiresIn: '24h'});
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, config.jwt_secret);
    } catch (err) {
        throw new HttpException(ErrorMessages.INVALID_TOKEN, StatusCodesEnum.FORBIDDEN);
    }
}

export const randomTokenString = async () => {
    return crypto.randomBytes(40).toString('hex');
}