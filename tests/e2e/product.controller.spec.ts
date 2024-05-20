import {connectToDB} from "../../src/config/database";
import UserModel from "../../src/models/user.model";
import request from "supertest";
import {app} from '../../src/app';
import {createProductPayload} from "../examples/product.test";
import ProductModel from "../../src/models/product.model";
import {ErrorMessages} from "../../src/utils/enums/error.messages";
import {SuccessMessages} from "../../src/utils/enums/success.messages";
import {faker} from "@faker-js/faker";
import * as HttpStatus from 'http-status';
import {ResponseStatus} from "../../src/dtos/responses/response.interface";
import {registerPayload} from "../examples/user.test.payload";
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
            .send(registerPayload);

        loginResponse = await request(app)
            .post(`${authBaseUrl}/login`)
            .set('Accept', 'application/json')
            .send(registerPayload);

        const data = JSON.parse(loginResponse.text);

        token = data.data.token;
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
                .send(createProductPayload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
            expect(data.status).toBe(ResponseStatus.ERROR);
            expect(data.message).toBe(ErrorMessages.UNAUTHENTICATED_USER);
        });

        it('it should throw an error if invalid authentication token is supplied', async () => {
            const response = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer Invalid token')
                .send(createProductPayload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
            expect(data.status).toBe(ResponseStatus.ERROR);
            expect(data.message).toBe(ErrorMessages.INVALID_TOKEN);
        });

        it('it should throw an error if product name is less than 8 characters', async () => {
            let payload = JSON.parse(JSON.stringify(createProductPayload));
            payload.name = 'name';

            const response = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.status).toBe(ResponseStatus.ERROR);
            expect(data.message).toBe(ErrorMessages.PRODUCT_NAME_MIN_LEGNTH_ERROR);
        });

        it('it should throw an error if product name is more than 100 characters', async () => {
            let payload = JSON.parse(JSON.stringify(createProductPayload));
            payload.name = faker.lorem.words(40);

            const response = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.status).toBe(ResponseStatus.ERROR);
            expect(data.message).toBe(ErrorMessages.PRODUCT_NAME_MAX_LEGNTH_ERROR);
        });

        it('it should throw an error if product description is less than 100 characters', async () => {
            let payload = JSON.parse(JSON.stringify(createProductPayload));
            payload.description = faker.lorem.words(5);

            const response = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.status).toBe(ResponseStatus.ERROR);
            expect(data.message).toBe(ErrorMessages.PRODUCT_DESCRIPTION_MIN_LEGNTH_ERROR);
        });

        it('it should throw an error if product price is not a number', async () => {
            let payload = JSON.parse(JSON.stringify(createProductPayload));
            payload.price = '100';

            const response = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.status).toBe(ResponseStatus.ERROR);
            expect(data.message).toBe(ErrorMessages.PRODUCT_PRICE_VALIDITY);
        });

        it('it should create a new product', async () => {
            const response = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductPayload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.CREATED);
            expect(data.status).toBe(ResponseStatus.SUCCESS);
            expect(data.message).toBe(SuccessMessages.PRODUCT_CREATED);
            expect(data.data.name).toBe(createProductPayload.name);
            expect(data.data.description).toBe(createProductPayload.description);
            expect(data.data.price).toBe(createProductPayload.price);
        });
    });

    describe('PUT: /api/products/:id', () => {
        it('it should throw an error if product does not exist', async () => {
            const invalidProductId = new ObjectId().toString();

            const response = await request(app)
                .put(`${baseUrl}/${invalidProductId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductPayload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
            expect(data.status).toBe(ResponseStatus.ERROR);
            expect(data.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
        });

        it('it should an error if product already exist', async () => {
            const firstProductResponse = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductPayload);

            let secondProduct = JSON.parse(JSON.stringify(createProductPayload));
            secondProduct.name = 'updated product name';

            await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(secondProduct);

            const productId = JSON.parse(firstProductResponse.text).data.id;

            let payload = JSON.parse(JSON.stringify(createProductPayload));
            payload.name = 'updated product name';

            const response = await request(app)
                .put(`${baseUrl}/${productId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.CONFLICT);
            expect(data.status).toBe(ResponseStatus.ERROR);
            expect(data.message).toBe(ErrorMessages.PRODUCT_ALREADY_EXISTS);
        });

        it('it should update an existing product', async () => {
            const createResponse = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductPayload);

            const productId = JSON.parse(createResponse.text).data.id;

            let payload = JSON.parse(JSON.stringify(createProductPayload));
            payload.name = 'updated product name';

            const response = await request(app)
                .put(`${baseUrl}/${productId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.OK);
            expect(data.status).toBe(ResponseStatus.SUCCESS);
            expect(data.message).toBe(SuccessMessages.PRODUCT_UPDATED);
            expect(data.data.name).toBe(payload.name);
            expect(data.data.description).toBe(createProductPayload.description);
            expect(data.data.price).toBe(createProductPayload.price);
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

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
            expect(data.status).toBe(ResponseStatus.ERROR);
            expect(data.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
        });

        it('it should delete an existing product', async () => {
            const createResponse = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductPayload);

            const productId = JSON.parse(createResponse.text).data.id;

            const response = await request(app)
                .delete(`${baseUrl}/${productId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.OK);
            expect(data.status).toBe(ResponseStatus.SUCCESS);
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

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
            expect(data.status).toBe(ResponseStatus.ERROR);
            expect(data.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
        });

        it('it should show a product', async () => {
            const createResponse = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductPayload);

            const productId = JSON.parse(createResponse.text).data.id;

            const response = await request(app)
                .get(`${baseUrl}/${productId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.OK);
            expect(data.status).toBe(ResponseStatus.SUCCESS);
            expect(data.message).toBe(SuccessMessages.PRODUCT_RETRIEVED);
            expect(data.data.name).toBe(createProductPayload.name);
            expect(data.data.price).toBe(createProductPayload.price);
        });

        it('it should show a product', async () => {
            const createResponse = await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductPayload);

            const productId = JSON.parse(createResponse.text).data.id;

            const response = await request(app)
                .get(`${baseUrl}/${productId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.OK);
            expect(data.status).toBe(ResponseStatus.SUCCESS);
            expect(data.message).toBe(SuccessMessages.PRODUCT_RETRIEVED);
            expect(data.data.name).toBe(createProductPayload.name);
            expect(data.data.price).toBe(createProductPayload.price);
        });
    });

    describe('GET: /api/products/all', () => {
        it('it should view all products', async () => {
            await request(app)
                .post(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(createProductPayload);

            let payload = JSON.parse(JSON.stringify(createProductPayload));
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

            expect(response.statusCode).toBe(HttpStatus.OK);
            expect(data.status).toBe(ResponseStatus.SUCCESS);
            expect(data.message).toBe(SuccessMessages.PRODUCTS_RETRIEVED);
            expect(data.data.length).toBe(2);
        });
    });
});
