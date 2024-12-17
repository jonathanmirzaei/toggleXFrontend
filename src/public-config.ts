
export const HOST = process.env.HOST ?? "localhost";
export const PORT = process.env.PORT ?? 8000;
export const USER_PORT = 8080;
export const API_SERVER_URL = `http://${HOST}:${PORT}/api`;

export const API_ADMIN_URL = `http://${HOST}:${USER_PORT}`;
