import express from 'express';
import {store, allProducts, updateProduct, showProduct, userProducts} from '../controllers/product.controller';
import {validate} from "../middlewares/request-validator";
import {createProductSchema} from '../schemas/product.schema';
import {validateUserToken} from "../middlewares/auth";

const router = express.Router();

router.get('/', allProducts);
router.get('/user', validateUserToken, userProducts);
router.get('/:id', showProduct);
router.post('/', [validateUserToken, validate(createProductSchema)], store);
router.put('/:id', [validateUserToken, validate(createProductSchema)], updateProduct);

export default router;