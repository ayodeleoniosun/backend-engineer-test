import {
    IsDefined,
    IsEmail,
    IsIn,
    IsNotEmpty,
    IsString, IsStrongPassword,
    MaxLength,
    MinLength,
    ValidateIf
} from "class-validator";
import {ErrorMessages} from "../../utils/enums/error.messages";

export class SignupDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MinLength(3, {message: ErrorMessages.FIRSTNAME_MIN_LEGNTH_ERROR})
    @MaxLength(100, {message: ErrorMessages.FIRSTNAME_MAX_LEGNTH_ERROR})
    firstname: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(3, {message: ErrorMessages.LASTNAME_MIN_LEGNTH_ERROR})
    @MaxLength(100, {message: ErrorMessages.LASTNAME_MAX_LEGNTH_ERROR})
    lastname: string;

    @IsDefined()
    @IsEmail({}, {message: ErrorMessages.INVALID_EMAIL_SUPPLIED})
    email: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(8, {message: ErrorMessages.PASSWORD_MIN_LEGNTH_ERROR})
    @IsStrongPassword({
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    }, {message: ErrorMessages.PASSWORD_STRENGTH_ERROR})
    password: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsIn([Math.random()], {
        message: ErrorMessages.PASSWORDS_DO_NOT_MATCH,
    })
    @ValidateIf( (e) => e.password !== e.password_confirmation)
    password_confirmation: string;
}