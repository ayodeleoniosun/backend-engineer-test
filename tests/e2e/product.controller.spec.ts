import {connectToDB} from "../../src/config/database";
import UserModel from "../../src/models/user.model";
import request from "supertest";
import {app} from '../../src/app';
import {createProductData} from "../seed/product.test";
import ProductModel from "../../src/models/product.model";
import {ErrorMessages} from "../../src/utils/enums/error.messages";
import {registrationData} from "../seed/user.test";
import {SuccessMessages} from "../../src/utils/enums/success.messages";
import {faker} from "@faker-js/faker";
import {StatusCodesEnum} from "../../src/utils/enums/status.codes.enum";
import {ObjectId} from "mongodb";

describe('Product end-to-end testing', () => {
    let loginResponse;
    let token: string;

    beforeAll(async () => {
        process.env.NODE_ENV = 'testing';
        await connectToDB();
    });

    beforeEach(async () => {
        await UserModel.deleteMany({});
        await ProductModel.deleteMany({});

        const authBaseUrl = '/api/auth';

        await request(app)
            .post(`${authBaseUrl}/register`)
            .set('Accept', 'application/json')
            .send(registrationData);

        loginResponse = await request(app)
            .post(`${authBaseUrl}/login`)
            .set('Accept', 'application/json')
            .send(registrationData);

        token = JSON.parse(loginResponse.text).data.token;
    });

    afterAll(async () => {
        await UserModel.deleteMany({});
        await ProductModel.deleteMany({});
    });

    const baseUrl = '/api/products';

    describe('POST: /api/products', () => {
        it('unauthenticated users cannot create new product', async () => {
            const response = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .send(createProductData);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.UNAUTHORIZED);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.UNAUTHENTICATED_USER);
        });

        it('it should throw an error if invalid authentication token is supplied', async () => {
            const response = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer Invalid token')
                .send(createProductData);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.FORBIDDEN);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.INVALID_TOKEN);
        });

        it('it should throw an error if product name is less than 8 characters', async () => {
            let payload = JSON.parse(JSON.stringify(createProductData));
            payload.name = 'name';

            const response = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.UNPROCESSABLE_ENTITY);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.PRODUCT_NAME_MIN_LEGNTH_ERROR);
        });

        it('it should throw an error if product name is more than 100 characters', async () => {
            let payload = JSON.parse(JSON.stringify(createProductData));
            payload.name = faker.lorem.words(40);

            const response = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.UNPROCESSABLE_ENTITY);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.PRODUCT_NAME_MAX_LEGNTH_ERROR);
        });

        it('it should throw an error if product description is less than 100 characters', async () => {
            let payload = JSON.parse(JSON.stringify(createProductData));
            payload.description = faker.lorem.words(5);

            const response = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.UNPROCESSABLE_ENTITY);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.PRODUCT_DESCRIPTION_MIN_LEGNTH_ERROR);
        });

        it('it should throw an error if product price is not a number', async () => {
            let payload = JSON.parse(JSON.stringify(createProductData));
            payload.price = '100';

            const response = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.UNPROCESSABLE_ENTITY);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.PRODUCT_PRICE_VALIDITY);
        });

        it('it should create a new product', async () => {
            const response = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductData);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.CREATED);
            expect(data.success).toBeTruthy();
            expect(data.message).toBe(SuccessMessages.PRODUCT_CREATED);
            expect(data.data.name).toBe(createProductData.name);
            expect(data.data.description).toBe(createProductData.description);
            expect(data.data.price).toBe(createProductData.price);
        });
    });

    describe('PUT: /api/products/:id', () => {
        it('it should throw an error if product does not exist', async () => {
            const invalidProductId = new ObjectId().toString();

            const response = await request(app)
                .put(`${baseUrl}/${invalidProductId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductData);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.NOT_FOUND);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
        });

        it('it should an error if product already exist', async () => {
            const firstProductResponse = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductData);

            let secondProduct = JSON.parse(JSON.stringify(createProductData));
            secondProduct.name = 'updated product name';

            await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(secondProduct);

            const productId = JSON.parse(firstProductResponse.text).data._id;

            let payload = JSON.parse(JSON.stringify(createProductData));
            payload.name = 'updated product name';

            const response = await request(app)
                .put(`${baseUrl}/${productId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.BAD_REQUEST);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.PRODUCT_ALREADY_EXISTS);
        });

        it('it should update an existing product', async () => {
            const createResponse = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductData);

            const productId = JSON.parse(createResponse.text).data._id;

            let payload = JSON.parse(JSON.stringify(createProductData));
            payload.name = 'updated product name';

            const response = await request(app)
                .put(`${baseUrl}/${productId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.OK);
            expect(data.success).toBeTruthy();
            expect(data.message).toBe(SuccessMessages.PRODUCT_UPDATED);
            expect(data.data.name).toBe(payload.name);
            expect(data.data.description).toBe(createProductData.description);
            expect(data.data.price).toBe(createProductData.price);
        });
    });

    describe('DELETE: /api/products/:id', () => {
        it('it should throw an error if product does not exist when deleting a product', async () => {
            const invalidProductId = new ObjectId().toString();

            const response = await request(app)
                .delete(`${baseUrl}/${invalidProductId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.NOT_FOUND);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
        });

        it('it should delete an existing product', async () => {
            const createResponse = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductData);

            const productId = JSON.parse(createResponse.text).data._id;

            const response = await request(app)
                .delete(`${baseUrl}/${productId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.OK);
            expect(data.success).toBeTruthy();
            expect(data.message).toBe(SuccessMessages.PRODUCT_DELETED);
        });
    });

    describe('GET: /api/products/:id', () => {
        it('it should throw an error if product does not exist when viewing a product details', async () => {
            const invalidProductId = new ObjectId().toString();

            const response = await request(app)
                .get(`${baseUrl}/${invalidProductId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.NOT_FOUND);
            expect(data.success).toBeFalsy();
            expect(data.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
        });

        it('it should show a product', async () => {
            const createResponse = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductData);

            const productId = JSON.parse(createResponse.text).data._id;

            const response = await request(app)
                .get(`${baseUrl}/${productId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.OK);
            expect(data.success).toBeTruthy();
            expect(data.message).toBe(SuccessMessages.PRODUCT_RETRIEVED);
            expect(data.data[0].name).toBe(createProductData.name);
            expect(data.data[0].price).toBe(createProductData.price);
        });

        it('it should show a product', async () => {
            const createResponse = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductData);

            const productId = JSON.parse(createResponse.text).data._id;

            const response = await request(app)
                .get(`${baseUrl}/${productId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.OK);
            expect(data.success).toBeTruthy();
            expect(data.message).toBe(SuccessMessages.PRODUCT_RETRIEVED);
            expect(data.data[0].name).toBe(createProductData.name);
            expect(data.data[0].price).toBe(createProductData.price);
        });
    });

    describe('GET: /api/products', () => {
        it('it should view all products', async () => {
            await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductData);

            let payload = JSON.parse(JSON.stringify(createProductData));
            payload.name = 'second product name';

            await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const response = await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(StatusCodesEnum.OK);
            expect(data.success).toBeTruthy();
            expect(data.message).toBe(SuccessMessages.PRODUCTS_RETRIEVED);
            expect(data.data.length).toBe(2);
        });
    });
});
