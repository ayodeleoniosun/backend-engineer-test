import express from 'express';
import {store} from '../controllers/product.controller';
import {validate} from "../middlewares/request-validator";
import {createProductSchema} from '../schemas/product.schema';
import {validateUserToken} from "../middlewares/auth";

const router = express.Router();

router.post('/', [validateUserToken, validate(createProductSchema)], store);

export default router;