import dotenv from "dotenv";
dotenv.config();

export const config = {
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    database: {
        host: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
    mail: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        username: process.env.MAIL_USERNAME,
        password: process.env.MAIL_PASSWORD,
        sender: process.env.MAIL_FROM_ADDRESS,
        subject: process.env.MAIL_FROM_NAME
    },
}