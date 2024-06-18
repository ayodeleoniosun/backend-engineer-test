import {Request, Response} from 'express';
import {ProductService} from '../services/product.service';
import {SuccessMessages} from "../utils/enums/success.messages";
import {ResponseDto} from "../dtos/responses/response.dto";
import {ResponseStatus} from "../dtos/responses/response.interface";
import * as HttpStatus from 'http-status';
import {Body, Delete, Get, JsonController, Param, Post, Put, Res, UseBefore} from "routing-controllers";
import {Service} from "typedi";
import {AuthenticateUser} from "../middlewares/auth.middleware";
import {ProductDto} from "../dtos/requests/product.dto";

@JsonController('/products')
@Service()
export class ProductController {
    public constructor(private productService: ProductService) {
    }

    @Get('/all')
    async allProducts(@Body() req: Request, @Res() res: Response) {
        try {
            const products = await this.productService.index();

            const successResponse = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.PRODUCTS_RETRIEVED, products);

            return res.status(HttpStatus.OK).json(successResponse)
        } catch (error: any) {
            const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse)
        }
    }

    @Get('/')
    @UseBefore(AuthenticateUser)
    async userProducts(@Body() req: Request, @Res() res: Response) {
        try {
            const products = await this.productService.myProducts(res.locals.user.id);

            const successResponse = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.PRODUCTS_RETRIEVED, products);

            return res.status(HttpStatus.OK).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }

    @Post('/')
    @UseBefore(AuthenticateUser)
    async store(@Body() productDto: ProductDto, @Res() res: Response) {
        try {
            const product = await this.productService.create(productDto, res.locals.user.id);

            const successResponse = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.PRODUCT_CREATED, product);

            return res.status(HttpStatus.CREATED).json(successResponse)
        } catch (error: any) {
            const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }

    @Put('/:id')
    @UseBefore(AuthenticateUser)
    async updateProduct(@Param('id') id: string, @Body() productDto: ProductDto, @Res() res: Response) {
        try {
            const product = await this.productService.update(id, productDto, res.locals.user.id);

            const successResponse = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.PRODUCT_UPDATED, product);

            return res.status(HttpStatus.OK).json(successResponse);

        } catch (error: any) {
            const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }

    @Get('/:id')
    async showProduct(@Param('id') id: string, @Body() req: Request, @Res() res: Response) {
        try {
            const product = await this.productService.show(id);
            const successResponse = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.PRODUCT_RETRIEVED, product);

            return res.status(HttpStatus.OK).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }

    @Delete('/:id')
    @UseBefore(AuthenticateUser)
    async deleteProduct(@Param('id') id: string, @Body() req: Request, @Res() res: Response) {
        try {
            await this.productService.destroy(id, res.locals.user.id);

            const successResponse = new ResponseDto(
                ResponseStatus.SUCCESS,
                SuccessMessages.PRODUCT_DELETED,
            );

            return res.status(HttpStatus.OK).json(successResponse);

        } catch (error: any) {
            const errorResponse = new ResponseDto(ResponseStatus.ERROR, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }
}