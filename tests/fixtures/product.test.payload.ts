import {faker} from "@faker-js/faker";

export let createProductPayload: {
    name: string;
    price: number;
    description: string;
    createdAt: Date;
};

createProductPayload = {
    name: faker.lorem.words(2),
    price: faker.number.int(100),
    description: faker.lorem.words(100),
    createdAt: faker.date.soon()
}
