import {faker} from "@faker-js/faker";

export let registerPayload: {
    firstname: string;
    lastname: string
    email: string;
    password: string;
    password_confirmation: string,
};

registerPayload = {
    firstname: faker.internet.displayName(),
    lastname: faker.internet.displayName(),
    email: faker.internet.email(),
    password: '12345678',
    password_confirmation: '12345678',
};