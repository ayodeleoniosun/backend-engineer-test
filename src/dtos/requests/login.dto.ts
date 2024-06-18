import {IsDefined, IsEmail, IsNotEmpty, IsString} from "class-validator";
import {ErrorMessages} from "../../utils/enums/error.messages";

export class LoginDto {
    @IsDefined()
    @IsEmail({}, {message: ErrorMessages.INVALID_EMAIL_SUPPLIED})
    email: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    password: string;
}