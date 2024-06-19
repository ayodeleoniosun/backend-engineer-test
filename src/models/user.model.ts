import {getModelForClass, ModelOptions, pre, prop} from "@typegoose/typegoose";
import {schemaConfig} from '../utils/database/schema.config';
import {hashPassword} from "../utils/helpers/password_hash";

@ModelOptions(schemaConfig)

@pre<User>("save", async function () {
    this.password = hashPassword(this.password);
})

export class User {
    public _id: string;

    @prop({type: String, minlength: 2, maxLength: 255, required: true})
    public firstname: string;

    @prop({type: String, required: true})
    public lastname: string;

    @prop({type: String, unique: true, required: true})
    public email: string;

    @prop({type: String, minlength: 8, maxLength: 32, required: true})
    public password: string;

    @prop({type: Date})
    public createdAt: Date;
}

const UserModel = getModelForClass(User);
//console.log(UserModel);

export default UserModel;