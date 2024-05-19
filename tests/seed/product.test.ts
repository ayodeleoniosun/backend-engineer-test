import {faker} from "@faker-js/faker";

export let productData: {
    userId: string,
    name: string;
    price: number;
    description: string;
    createdAt: Date;
};

productData = {
    userId: faker.string.uuid(),
    name: faker.lorem.words(2),
    price: faker.number.int(100),
    description: faker.lorem.words(100),
    createdAt: faker.date.soon()
};

export let createProductData: {
    userId: string,
    name: string;
    price: number;
    description: string;
    createdAt: Date;
};

createProductData = {
    userId: faker.string.uuid(),
    name: faker.lorem.words(2),
    price: faker.number.int(100),
    description: faker.lorem.words(100),
    createdAt: faker.date.soon()
}
