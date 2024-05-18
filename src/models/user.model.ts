import {getModelForClass, ModelOptions, prop} from "@typegoose/typegoose";
import {schemaConfig} from '../utils/database/schema.config';

@ModelOptions(schemaConfig)

export class User {
    @prop({type: String, minlength: 2, maxLength: 255, required: true})
    public firstname: string;

    @prop({type: String, required: true})
    public lastname: string;

    @prop({type: String, unique: true, required: true})
    public email: string;

    @prop({type: String, minlength: 8, maxLength: 32, required: true})
    public password: string;
}

const UserModel = getModelForClass(User);

export default UserModel;