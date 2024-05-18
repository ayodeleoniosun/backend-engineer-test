import {connect, connection} from "mongoose";
import config from "./index";

export async function connectToDB() {
    try {
        const environment = process.env.NODE_ENV;

        let uri;

        if (environment === 'testing') {
            uri = config.database.uri + "" + config.database.test
        } else {
            uri = config.database.uri + "" + config.database.production
        }

        await connect(uri ?? 'none');

    } catch (error) {
        console.log("Error:", error);
    }
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