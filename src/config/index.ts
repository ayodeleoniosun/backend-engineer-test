import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT,
    jwt_secret: '10f8ee77addc4c276122538b0088f238a5cb6dfbc467caaff63194550a4bd1f679315a2f3a7085f8',
    database: {
        production: process.env.PRODUCTION_DATABASE_NAME,
        test: process.env.TEST_DATABASE_NAME,
        uri: process.env.DATABASE_URI
    },
}