import {connectToDB} from "../../src/config/database";
import ProductModel from "../../src/models/product.model";
import {testData} from '../seed/user.test';
import {register} from "../../src/services/auth.service";
import UserModel from "../../src/models/user.model";
import {create, destroy, index, myProducts, show, update} from "../../src/services/product.service";
import {createProductData, productData} from "../seed/product.test";
import {ErrorMessages} from "../../src/utils/enums/error.messages";
import {ObjectId} from 'mongodb';

describe('Product unit tests', () => {
    let user: any;

    beforeAll(async () => {
        process.env.NODE_ENV = 'testing';
        await connectToDB();
    });

    beforeEach(async () => {
        await UserModel.deleteMany({});
        await ProductModel.deleteMany({});

        user = await register(testData);
        await create(productData, user._id);
    });

    afterAll(async () => {
        await UserModel.deleteMany({});
        await ProductModel.deleteMany({});
    });

    describe('All Products', () => {
        it('it should display all products', async () => {
            await create(createProductData, user._id);

            let payload = JSON.parse(JSON.stringify(createProductData));
            payload.name = 'second product name';

            await create(payload, user._id);

            const response = await index();

            expect(response.length).toBe(3);
        });
    });

    describe('My Products', () => {
        it('it should display my products', async () => {
            await create(createProductData, user._id);

            let payload = JSON.parse(JSON.stringify(createProductData));
            payload.name = 'second product name';

            await create(payload, user._id);

            //create another user and his products
            let anotherUserPayload = JSON.parse(JSON.stringify(testData));
            anotherUserPayload.email = 'anotheruser@example.com';

            const anotherUser = await register(anotherUserPayload);
            await create(createProductData, anotherUser._id);

            const response = await myProducts(anotherUser._id);

            expect(response.length).toBe(1);
        });
    });

    describe('Create Product', () => {
        it('it should throw an error if a product already exist', async () => {
            try {
                await create(productData, user._id);
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.PRODUCT_ALREADY_EXISTS);
            }
        });

        it('it can create new product', async () => {
            const response = await create(createProductData, user._id);

            expect(response.name).toBe(createProductData.name);
            expect(response.description).toBe(createProductData.description);
            expect(response.price).toBe(createProductData.price);
        });
    });

    describe('Update Product', () => {
        it('it should throw an error if a product does not exist', async () => {
            try {
                const invalidId = new ObjectId().toString();

                await update(invalidId, createProductData, user._id);
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
            }
        });

        it('it cannot update existing product with the same product name', async () => {
            try {
                const firstCreatedProduct = await create(createProductData, user._id);

                let payload = JSON.parse(JSON.stringify(createProductData));
                payload.name = 'updated product name';

                await create(payload, user._id);
                await update(firstCreatedProduct._id, payload, user._id);
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.PRODUCT_ALREADY_EXISTS);
            }
        });

        it('it can update existing product', async () => {
            const createProduct = await create(createProductData, user._id);

            let payload = JSON.parse(JSON.stringify(createProductData));
            payload.name = 'updated product name';
            payload.description = 'updated product description';

            const response = await update(createProduct._id, payload, user._id);

            expect(response!.name).toBe(payload.name);
            expect(response!.description).toBe(payload.description);
            expect(response!.price).toBe(payload.price);
        });
    });

    describe('Show Product', () => {
        it('it should throw an error if a product does not exist', async () => {
            try {
                const invalidId = new ObjectId().toString();

                await show(invalidId);
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
            }
        });

        it('it should show product details', async () => {
            const createProduct = await create(createProductData, user._id);
            const response = await show(createProduct._id);

            expect(response.length).toBe(1);
            expect(response[0]!.name).toBe(createProduct.name);
            expect(response[0]!.description).toBe(createProduct.description);
            expect(response[0]!.price).toBe(createProduct.price);
        });
    });

    describe('Delete Product', () => {
        it('it should throw an error if a product does not exist', async () => {
            try {
                const invalidId = new ObjectId().toString();

                await destroy(invalidId, user._id);
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
            }
        });

        it('it should delete product', async () => {
            const createProduct = await create(createProductData, user._id);
            const response = await destroy(createProduct._id, user._id);

            expect(response!._id.toString()).toBe(createProduct._id.toString());
            expect(response!.name).toBe(createProduct.name);
            expect(response!.description).toBe(createProduct.description);
            expect(response!.price).toBe(createProduct.price);
        });
    });
});