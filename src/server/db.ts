import {MongoClient} from "mongodb";

import config from "./config";

let connectedClient;

export const connectClient = async () => {

    if(connectedClient) return connectedClient.db(config.DATABASE_NAME);

    const client = new MongoClient(config.MONGO_URI);
    await client.connect()
    await client.db(config.DATABASE_NAME).command({ping: 1})  
    connectedClient = client
    console.info("Connected to MongoDB")

    return connectedClient.db(config.DATABASE_NAME)
}

export const stopClient = async () => {
    await connectedClient?.close();
}