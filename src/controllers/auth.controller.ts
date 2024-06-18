import {Response} from 'express';
import {AuthService} from '../services/auth.service';
import * as HttpStatus from 'http-status';
import {SuccessMessages} from '../utils/enums/success.messages';
import {ResponseDto} from "../dtos/responses/response.dto";
import {ResponseStatus} from "../dtos/responses/response.interface";
import {Service} from "typedi";
import {Body, JsonController, Post, Res} from "routing-controllers";
import {SignupDto} from "../dtos/requests/signup.dto";
import {LoginDto} from "../dtos/requests/login.dto";

@JsonController('/auth')
@Service()
export class AuthController {
    public constructor(private authService: AuthService) {
    }

    @Post('/register')
    async register (@Body() signupDto: SignupDto, @Res() res: Response) {
        try {
            const user = await this.authService.register(signupDto);

            const successResponse = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.REGISTRATION_SUCCESSFUL, user);

            return res.status(HttpStatus.CREATED).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }

    @Post('/login')
    async login (@Body() loginDto: LoginDto, @Res() res: Response) {
        try {
            const user = await this.authService.login(loginDto);

            const successResponse = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.LOGIN_SUCCESSFUL, user);

            return res.status(HttpStatus.OK).json(successResponse);

        } catch (error: any) {
            const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }
}