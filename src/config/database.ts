import {connect, connection} from "mongoose";
import {config} from "./index";

export async function connectToDB() {
    try {
        await connect(config.database.uri);
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