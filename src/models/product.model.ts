import {getModelForClass, ModelOptions, prop} from "@typegoose/typegoose";
import {schemaConfig} from '../utils/database/schema.config';

@ModelOptions(schemaConfig)

export class Product {
    public _id: string;

    @prop({type: String, required: true})
    public userId: string;

    @prop({type: String, minlength: 2, maxLength: 255, required: true})
    public name: string;

    @prop({type: String, required: true})
    public description: string;

    @prop({type: Number, required: true})
    public price: number;

    @prop({type: Date})
    public createdAt: Date;
}

const ProductModel = getModelForClass(Product);

export default ProductModel;