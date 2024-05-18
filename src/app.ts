import express, {Request, Response} from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import config from './config';
import {connectToDB} from "./config/database";
import {StatusCodesEnum} from "./utils/enums/status.codes.enum";

//routes
import authRouter from './routes/auth.route';
import productRouter from './routes/product.route';

const {port} = config;

export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);

app.use("*", (req: Request, res: Response) => {
    return res.status(StatusCodesEnum.NOT_FOUND).json({
        success: false,
        message: 'Endpoint does not exist.',
    });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response) => {
    err.statusCode = err.statusCode || StatusCodesEnum.INTERNAL_SERVER_ERROR;

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
});

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    await connectToDB();
});