import express from 'express';
import {store, allProducts} from '../controllers/product.controller';
import {validate} from "../middlewares/request-validator";
import {createProductSchema} from '../schemas/product.schema';
import {validateUserToken} from "../middlewares/auth";

const router = express.Router();

router.get('/', validateUserToken, allProducts);
router.post('/', [validateUserToken, validate(createProductSchema)], store);

export default router;