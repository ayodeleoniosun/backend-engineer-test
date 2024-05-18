import {DocumentType} from "@typegoose/typegoose";
import {User} from "../../models/user.model";
import jwt from "jsonwebtoken";
import config from "../../config";
import crypto from "crypto";

export const generateToken = async (user: DocumentType<User>) => {
    const publicKey = Buffer.from(
        config.jwt_secret,
        'base64'
    ).toString('ascii');

    return jwt.sign({id: user.id, email: user.email}, publicKey, { expiresIn: '24h' });
}

export const verifyToken = async (token: string) => {
    //return jwt.verify(token, config.jwt_secret);
}

export const randomTokenString = async () => {
    return crypto.randomBytes(40).toString('hex');
}