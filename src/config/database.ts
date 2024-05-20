import {connect, connection, disconnect} from "mongoose";
import config from "./index";

export const getDatabaseUri = () => {
    const environment = process.env.NODE_ENV;

    let uri: string | undefined = config.database.uri;

    if (environment === 'testing') {
        return uri + "" + config.database.test
    }

    return uri + "" + config.database.production;
}

export async function connectToDB() {
    try {
        const uri: string = getDatabaseUri();

        await connect(uri ?? 'none');

    } catch (error) {
        console.log("Error:", error);
    }
}

export async function closeDB() {
    await disconnect();
}

connection.on("connected", () => {
    console.log("Database connected to:", connection.db.databaseName);
});

connection.on("error", (error) => {
    console.error("Unable to connect to db", error);
});

connection.on("disconnected", () => {
    console.log("Database disconnected");
});