import express, {Request, Response} from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from './routes/auth.route';
import "dotenv/config";
import config from './config';
import {connectToDB} from "./config/database";

const {port} = config;

export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRouter);

app.use("*", (req: Request, res: Response) => {
    return res.status(404).json({
        success: false,
        message: 'URL does not exist.',
    });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
});

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    await connectToDB();
});