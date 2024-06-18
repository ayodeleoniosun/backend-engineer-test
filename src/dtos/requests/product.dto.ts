import {IsDefined, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength,} from "class-validator";

import {ErrorMessages} from "../../utils/enums/error.messages";

export class ProductDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MinLength(8, {message: ErrorMessages.PRODUCT_NAME_MIN_LEGNTH_ERROR})
    @MaxLength(100, {message: ErrorMessages.PRODUCT_NAME_MAX_LEGNTH_ERROR})
    name: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(100, {message: ErrorMessages.PRODUCT_DESCRIPTION_MIN_LEGNTH_ERROR})
    description: string;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber({}, {message: ErrorMessages.PRODUCT_PRICE_VALIDITY})
    price: number;
}