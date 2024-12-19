
export const HOST = process.env.HOST || "https://togglexbackhand-d3gbereja6dkaba6.israelcentral-01.azurewebsites.net";
export const PORT = process.env.PORT || 443;
export const USER_PORT = 8080;
export const API_SERVER_URL = `http://${HOST}:${PORT}/api`;

export const API_ADMIN_URL = `http://${HOST}:${USER_PORT}`;
