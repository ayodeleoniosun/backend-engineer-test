import {createUser} from '../services/auth.service';
import {Request, Response} from 'express';

export const register = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const user = await createUser(req.body);

        return res.status(201).json({
            success: true,
            data: user
        })
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            error,
        })
    }
}