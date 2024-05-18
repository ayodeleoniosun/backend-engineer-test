import dotenv from "dotenv";
dotenv.config();

export default {
    port: process.env.PORT,
    jwt_secret:'10f8ee77addc4c276122538b0088f238a5cb6dfbc467caaff63194550a4bd1f679315a2f3a7085f8',
    db_uri: process.env.MONGODB_URI,
}