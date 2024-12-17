import express from "express";
import os from "node:os";

import config from "./config";
import apiRouter from "./api-router";
import serverRender from "./render";

const server = express();

server.use(express.static("dist"));

server.set("view engine", "ejs");

// server.use((req, res, next) => {
//     res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://localhost:8080");
//     next();
// });

server.use("/api", apiRouter);
server.get("/api/allocation", apiRouter);

server.delete(["/deleteFeature/:id", "/deleteProject/:id", "/deleteEnvironment/:id"], apiRouter);

server.get(["/",
    "/features",
    "/experiemnts",
    "/feature/:name",
    "/experiement/:name",
    "/feature/:id",
    "/experiement/:id",
    "/projects",
    "/users",
    "/project/:id",
    "/addProject/:id",
    "/environments",
    "/analytics",
    "/environment/:id",
    "/addEnvironments/:id"],
    async (req, res) => {

        const { initialMarkup, initialData } = await serverRender(req);

        res.render("index", {
            initialMarkup,
            initialData
        });
    });

server.listen(config.PORT, config.HOST, () => {
    console.info(
        `Express server is listening at ${config.SERVER_URL}`,
        `\nFree Mem: ${os.freemem() / 1024 / 1024}`,
    );
});

