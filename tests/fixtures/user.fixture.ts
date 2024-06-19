import {faker} from "@faker-js/faker";
import {hashPassword} from "../../src/utils/helpers/password_hash";
import {User} from "../../src/models/user.model";
import mongoose from "mongoose";

export const getUser = (overrides?: Partial<User>): Partial<User> => {
    const user = new User();
    user._id = new mongoose.Types.ObjectId().toString();
    user.firstname = faker.internet.displayName();
    user.lastname = faker.internet.displayName();
    user.email = faker.internet.email();
    user.password = hashPassword('JohnDoe@2024');
    user.createdAt = new Date();
    return {...user, ...overrides};
};