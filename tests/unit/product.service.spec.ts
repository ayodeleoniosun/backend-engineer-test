import {connectToDB} from "../../src/config/database";
import ProductModel from "../../src/models/product.model";
import {registerPayload} from '../examples/user.test.payload';
import {register} from "../../src/services/auth.service";
import UserModel from "../../src/models/user.model";
import {create, destroy, index, myProducts, show, update} from "../../src/services/product.service";
import {createProductPayload} from "../examples/product.test";
import {ErrorMessages} from "../../src/utils/enums/error.messages";
import {ObjectId} from "mongodb";

describe('Product unit tests', () => {
    let user: any;

    beforeAll(async () => {
        process.env.NODE_ENV = 'testing';
        await connectToDB();
    });

    beforeEach(async () => {
        await UserModel.deleteMany({});
        await ProductModel.deleteMany({});

        user = await register(registerPayload);
    });

    afterAll(async () => {
        await UserModel.deleteMany({});
        await ProductModel.deleteMany({});
    });

    describe('All Products', () => {
        it('it should display all products', async () => {
            await create(createProductPayload, user.id);

            let secondProductPayload = JSON.parse(JSON.stringify(createProductPayload));
            secondProductPayload.name = 'second product name';

            await create(secondProductPayload, user.id);

            let thirdProductPayload = JSON.parse(JSON.stringify(createProductPayload));
            thirdProductPayload.name = 'third product name';

            await create(thirdProductPayload, user.id);

            const response = await index();

            expect(response.length).toBe(3);
        });
    });

    describe('My Products', () => {
        it('it should display my products', async () => {
            await create(createProductPayload, user.id);

            let secondProductPayload = JSON.parse(JSON.stringify(createProductPayload));
            secondProductPayload.name = 'second product name';

            await create(secondProductPayload, user.id);

            //create another user and his products
            let anotherUserPayload = JSON.parse(JSON.stringify(registerPayload));
            anotherUserPayload.email = 'anotheruser@example.com';

            const anotherUser = await register(anotherUserPayload);
            await create(createProductPayload, anotherUser.id);

            const response = await myProducts(anotherUser.id);

            expect(response.length).toBe(1);
        });
    });

    describe('Create Product', () => {
        it('it should throw an error if a product already exist', async () => {
            try {
                await create(createProductPayload, user.id);
                await create(createProductPayload, user.id);
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.PRODUCT_ALREADY_EXISTS);
            }
        });

        it('it can create new product', async () => {
            const response = await create(createProductPayload, user.id);

            expect(response.name).toBe(createProductPayload.name);
            expect(response.description).toBe(createProductPayload.description);
            expect(response.price).toBe(createProductPayload.price);
        });
    });

    describe('Update Product', () => {
        it('it should throw an error if a product does not exist', async () => {
            try {
                const invalidId = new ObjectId().toString();

                await update(invalidId, createProductPayload, user.id);
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
            }
        });

        it('it cannot update existing product with the same product name', async () => {
            try {
                const firstCreatedProduct = await create(createProductPayload, user.id);

                let payload = JSON.parse(JSON.stringify(createProductPayload));
                payload.name = 'updated product name';

                await create(payload, user.id);
                await update(firstCreatedProduct.id, payload, user.id);
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.PRODUCT_ALREADY_EXISTS);
            }
        });

        it('it can update existing product', async () => {
            const createProduct = await create(createProductPayload, user.id);

            let payload = JSON.parse(JSON.stringify(createProductPayload));
            payload.name = 'updated product name';
            payload.description = 'updated product description';

            const response = await update(createProduct.id, payload, user.id);

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
            const createProduct = await create(createProductPayload, user.id);
            const response = await show(createProduct.id);

            expect(response.name).toBe(createProduct.name);
            expect(response.description).toBe(createProduct.description);
            expect(response.price).toBe(createProduct.price);
        });
    });


    describe('Delete Product', () => {
        it('it should throw an error if a product does not exist', async () => {
            try {
                const invalidId = new ObjectId().toString();

                await destroy(invalidId, user.id);
            } catch (err: any) {
                expect(err.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
            }
        });

        it('it should delete product', async () => {
            const createProduct = await create(createProductPayload, user.id);
            const response = await destroy(createProduct.id, user.id);
           
            expect(response!.id.toString()).toBe(createProduct.id.toString());
            expect(response!.name).toBe(createProduct.name);
            expect(response!.description).toBe(createProduct.description);
            expect(response!.price).toBe(createProduct.price);
        });
    });
});