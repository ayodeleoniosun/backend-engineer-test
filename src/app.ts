import express, {Request, Response} from "express";
import cors from "cors";
import 'reflect-metadata';
import helmet from "helmet";
import "dotenv/config";
import * as HttpStatus from 'http-status';
import {useContainer as routingUseContainer, useExpressServer} from 'routing-controllers';
import {Container} from 'typedi';

import {ResponseDto} from "./dtos/responses/response.dto";
import {ResponseStatus} from "./dtos/responses/response.interface";
import {SuccessMessages} from "./utils/enums/success.messages";
import path from "path";

routingUseContainer(Container);

export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

useExpressServer(app, {
    defaultErrorHandler: false,
    routePrefix: '/api',
    cors: true,
    controllers: [path.join(__dirname, '/controllers/*.ts')],
    middlewares: [path.join(__dirname, '/middlewares/*.ts')],
});


app.get("/", (req: Request, res: Response) => {
    const successResponse = new ResponseDto(ResponseStatus.SUCCESS, SuccessMessages.WELCOME);

    return res.status(HttpStatus.OK).json(successResponse);
});