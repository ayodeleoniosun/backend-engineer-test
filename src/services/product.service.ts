import {Service} from "typedi";
import {ProductRepository} from "../repositories/product.repository";
import ProductModel from "../models/product.model";
import {ProductModelDto} from "../dtos/models/product.model.dto";
import HttpException from "../utils/exceptions/http.exception";
import {ErrorMessages} from "../utils/enums/error.messages";
import * as HttpStatus from 'http-status';
import {ProductDto} from "../dtos/requests/product.dto";

@Service()
export class ProductService {
    public constructor(private productRepository: ProductRepository) {
    }

    async index() {
        const products = await this.productRepository.findAllProducts();

        return products.map((product) => new ProductModelDto(product._id, product.name, product.description, product.price, product.createdAt));
    }

    async myProducts(userId: string) {
        const products = await this.productRepository.findUserProducts(userId);

        return products.map((product) => new ProductModelDto(product._id, product.name, product.description, product.price, product.createdAt));
    }

    async create(payload: ProductDto, userId: string): Promise<ProductModelDto> {
        const {name, description, price} = payload;

        const product = await this.productRepository.findProductByCriteria({name: payload.name, userId});

        if (product) {
            throw new HttpException(ErrorMessages.PRODUCT_ALREADY_EXISTS, HttpStatus.CONFLICT);
        }

        const {_id, createdAt} = await this.productRepository.create({userId, name, description, price});

        return new ProductModelDto(_id, name, description, price, createdAt)
    }

    async update(id: string, payload: ProductDto, userId: string) {
        const {name, description, price} = payload;

        const product = await this.productRepository.findProductByCriteria({_id: id, userId});

        if (!product) {
            throw new HttpException(ErrorMessages.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const productExists = await this.productRepository.findExistingProductByName(id, payload.name, userId);

        if (productExists) {
            throw new HttpException(ErrorMessages.PRODUCT_ALREADY_EXISTS, HttpStatus.CONFLICT);
        }

        const updatedProduct = ProductModel.findByIdAndUpdate(
            {_id: id},
            {name, description, price},
            {new: true}
        );

        return new ProductModelDto(updatedProduct._id, name, description, price, updatedProduct.createdAt);
    }

    async show(id: string) {
        const product = await this.productRepository.findById(id);

        if (!product) {
            throw new HttpException(ErrorMessages.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const {_id, name, description, price, createdAt} = product;

        return new ProductModelDto(_id, name, description, price, createdAt)
    }

    async destroy(id: string, userId: string) {
        const product = await this.productRepository.findProductByCriteria({_id: id, userId});

        if (!product) {
            throw new HttpException(ErrorMessages.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return ProductModel.findByIdAndDelete(id);
    }
}
