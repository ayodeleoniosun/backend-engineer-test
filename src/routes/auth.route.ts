import express from 'express';
import {loginUser, registerUser} from '../controllers/auth.controller';
import {validate} from "../middlewares/request-validator";
import {registrationSchema} from "../schemas/user.schema";

const router = express.Router();

router.post('/register', validate(registrationSchema), registerUser);
router.post('/login', loginUser);

export default router;