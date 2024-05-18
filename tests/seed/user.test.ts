import {faker} from "@faker-js/faker";

export let testData: {
    createdAt: Date;
    firstname: string;
    password: string;
    email: string;
    lastname: string
};

testData = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'johndoe@gmail.com',
    password: '12345678',
    createdAt: faker.date.soon()
};

export let fakeData: {
    createdAt: Date;
    firstname: string;
    password: string;
    email: string;
    lastname: string
};

fakeData = {
    firstname: faker.internet.displayName(),
    lastname: faker.internet.displayName(),
    email: faker.internet.email(),
    password: '12345678',
    createdAt: faker.date.soon()
};