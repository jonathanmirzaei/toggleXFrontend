//process.env

const env = process.env


export const HOST = env.HOST ?? "127.0.0.1";
export const PORT = env.PORT ?? "8000";
export const SERVER_URL = `http://${HOST}:${PORT}`;

export const MONGO_URI = env.MONGO_URI ?? "mongodb://localhost:27017";
export const DATABASE_NAME = env.DATABASE_NAME ?? "local";

export default{
    PORT,
    HOST,
    SERVER_URL,
    MONGO_URI,
    DATABASE_NAME
}