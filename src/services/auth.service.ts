import userModel, {User} from '../models/user.model';

export const createUser = async (payload: User) => {
    const {firstname, lastname, email, password} = payload;

    return await userModel.create({firstname, lastname, email, password});
}
