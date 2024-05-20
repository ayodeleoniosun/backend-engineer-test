import express, {Request, Response} from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import config from './config';
import {connectToDB} from "./config/database";
import * as HttpStatus from 'http-status';

//routes
import authRouter from './routes/auth.route';
import productRouter from './routes/product.route';
import {ResponseDto} from "./dtos/responses/response.dto";
import {ResponseStatus} from "./dtos/responses/response.interface";

const {port} = config;

export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);

app.use("*", (req: Request, res: Response) => {
    const successResponse = new ResponseDto(ResponseStatus.SUCCESS, 'Welcome to Product Store API');

    return res.status(HttpStatus.NOT_FOUND).json(successResponse);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response) => {
    err.statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = new ResponseDto(ResponseStatus.ERROR, err.message);

    res.status(err.statusCode).json(errorResponse);
});

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    await connectToDB();
});