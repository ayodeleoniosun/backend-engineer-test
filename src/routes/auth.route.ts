import express from 'express';
import {register, login} from '../controllers/auth.controller';
import {validate} from "../middlewares/request-validator";
import {registrationSchema} from "../schemas/user.schema";

const router = express.Router();

router.post('/register', validate(registrationSchema), register);
router.post('/login', login);

export default router;