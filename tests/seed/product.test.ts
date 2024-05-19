import {faker} from "@faker-js/faker";

export let productData: {
    userId: string,
    name: string;
    price: string;
    description: string;
    createdAt: Date;
};

productData = {
    userId: faker.string.uuid(),
    name: faker.lorem.word(),
    price: faker.commerce.price(),
    description: faker.lorem.words(10),
    createdAt: faker.date.soon()
};

export let createProductData: {
    userId: string,
    name: string;
    price: string;
    description: string;
    createdAt: Date;
};

createProductData = {
    userId: faker.string.uuid(),
    name: faker.lorem.word(),
    price: faker.commerce.price(),
    description: faker.lorem.words(10),
    createdAt: faker.date.soon()
}
