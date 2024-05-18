import {DocumentType} from "@typegoose/typegoose";
import {User} from "../../models/user.model";
import jwt from "jsonwebtoken";
import config from "../../config";
import crypto from "crypto";
import CustomException from "../exceptions/custom.exception";

export const generateToken = async (user: DocumentType<User>) => {
    return jwt.sign({id: user.id, email: user.email}, config.jwt_secret, { expiresIn: '24h' });
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, config.jwt_secret);
    } catch (err) {
        throw new CustomException("Invalid token. Try again");
    }
}

export const randomTokenString = async () => {
    return crypto.randomBytes(40).toString('hex');
}