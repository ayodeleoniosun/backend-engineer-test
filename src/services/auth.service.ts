import userModel, {User} from '../models/user.model';
import CustomException from "../utils/exceptions/custom.exception";

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