import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("*", (req: Request, res: Response) => {
    const path = req.originalUrl;
    const method = req.method;
    return res.status(404).json({
        success: false,
        path,
        method,
        message: 'URL does not exist.',
    });
});

export default app;