import {SignupDto} from "../dtos/requests/signup.dto";
import {Service} from "typedi";
import UserModel, {User} from "../models/user.model";

@Service()
export class AuthRepository {
    async create(payload: Partial<SignupDto>): Promise<UserModel> {
        return await UserModel.create(payload);
    }

    async getUserByEmail(email: string): Promise<User> {
        return UserModel.findOne({email});
    }
}