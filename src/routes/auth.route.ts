import express from 'express';
import {register} from '../controllers/auth.controller';
import {validate} from "../middlewares/request-validator";
import {registrationSchema} from "../schemas/user.schema";

const router = express.Router();

router.post('/register', validate(registrationSchema), register);

export default router;