import dotenv from "dotenv";
dotenv.config();

export default {
    port: process.env.PORT,
    jwt_secret:'mainstack-backend-engineer-test@2024',
    db_uri: process.env.MONGODB_URI,
}