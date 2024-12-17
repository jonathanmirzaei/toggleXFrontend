import express from "express";
import cors from "cors";
const { ObjectId } = require('mongodb');

import { connectClient } from "./db";
import { updateProject } from "../api-client";

const router = express.Router();

router.use(cors(), function (req, res, next) {
    console.log(req.url + "A new request received at " + Date.now());
    next();
});

// router.use('/',function(req, res, next){
//     console.log("A new request received at " + Date.now());
//     next();
//  });

router.use(express.json());
// import testData from "../../local.features.json";

router.get("/api/allocation", async (req, res) => {
    const client = await connectClient();
    const features = await client
        .collection("features")
        .find({ environment: req.query.environment, project: req.query.project })
        .toArray();

    console.log("/api/allocation");
    res.send({ features: features });
});



router.get("/features", async (req, res) => {
    const client = await connectClient();
    const features = await client
        .collection("features")
        .find({ type: "flag", environment: req.query.environment, project: req.query.project })
        .toArray();
    res.send({ features: features });
});

router.get("/fetchAllFeatureList", async (req, res) => {
    const client = await connectClient();
    const features = await client
        .collection("features")
        .find({ environment: req.query.environment, project: req.query.project })
        .toArray();
    res.send({ features: features });
});

router.get("/events", async (req, res) => {
    const client = await connectClient();
    const events = await client
        .collection("events")
        .find({project: req.query.project, name: req.query.flagName })
        .toArray();
    res.send({ events: events });
});

router.get("/fetchTotalActiveUsers", async (req, res) => {
    const client = await connectClient();
    const totalActiveUsers = await client
        .collection("events")
        .distinct("userId", { project: req.query.project })
    res.send({ totalActiveUsers: totalActiveUsers });
});

// router.get("/events", async (req, res) => {
//     const client = await connectClient();
//     const events = await client
//         .collection("events")
//         .find({project: req.query.project, name: req.query.flagName })
//     res.send({ events: events });
// });

//start projects
router.get("/projects", async (req, res) => {
    const client = await connectClient();
    const projects = await client
        .collection("projects")
        .find()
        .toArray();
    res.send({ projects: projects });
});

router.delete("/deleteProject/:id", async (req, res) => {
    const client = await connectClient();
    console.log("req.params.id");
    console.log(req.params);
    const response = await client
        .collection("projects")
        .deleteOne({ _id: new ObjectId(req.params.id) },
            (err, user) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(user);
            }
        );
    res.send({ updatedProject: response });
});

router.post("/addProject", async (req, res) => {
    const client = await connectClient();
    console.log(req.params);
    const document = await client
        .collection("projects")
        .insertOne(
            {
                name: req.body.name,
                last_modified_date: new Date()
            },
            { returnDocument: "after" },
            (err, user) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(user);
            }
        );
    console.log("document");
    console.log(document);
    res.send({ updatedProject: document });
});
router.post("/project/:id", async (req, res) => {
    const client = await connectClient();

    const document = await client
        .collection("projects")
        .findOneAndUpdate({ _id: new ObjectId(req.params.id) },
            {
                $set: {
                    name: req.body.name,
                    last_modified_date: new Date(),
                }
            },
            { returnDocument: "after" },
            (err, user) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(user);
            }
        );

    res.send({ updatedProject: document });
});
//end projects
//start environments
router.get("/environments", async (req, res) => {
    const client = await connectClient();
    const environments = await client
        .collection("environments")
        .find()
        .toArray();
    res.send({ environments: environments });
});

router.delete("/deleteEnvironment/:id", async (req, res) => {
    const client = await connectClient();
    // console.log("req.params.id");
    // console.log(req.params);
    const response = await client
        .collection("environments")
        .deleteOne({ _id: new ObjectId(req.params.id) },
            (err, user) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(user);
            }
        );
    res.send({ updatedEnvironment: response });
});

router.post("/impression", async (req, res) => {

    const eventData = {
        project: req.query.project,
        event: req.body.event,
        type: req.body.type,
        name: req.body.name,
        status: req.body.status,
        userId: req.body.userId,
        variation: req.body.variation,
        date: new Date(),
    };

    const client = await connectClient();

    const filteredDocument = Object.fromEntries(
        Object.entries(eventData).filter(([_, value]) => value !== null && value !== undefined && value !== "")
    );

    const document = await client
        .collection("events")
        .insertOne(filteredDocument, { returnDocument: "after" })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ error: "Failed to insert document" });
            return;
        });
    res.send({ updatedEnvironment: document });
});

router.post("/addEnvironment", async (req, res) => {
    const client = await connectClient();
    console.log(req.params);
    const document = await client
        .collection("environments")
        .insertOne(
            {
                name: req.body.name,
                last_modified_date: new Date()
            },
            { returnDocument: "after" },
            (err, user) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(user);
            }
        );
    res.send({ updatedEnvironment: document });
});
router.post("/environment/:id", async (req, res) => {
    const client = await connectClient();

    const document = await client
        .collection("environments")
        .findOneAndUpdate({ _id: new ObjectId(req.params.id) },
            {
                $set: {
                    name: req.body.name,
                    last_modified_date: new Date(),
                }
            },
            { returnDocument: "after" },
            (err, user) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(user);
            }
        );

    res.send({ updatedEnvironments: document });
});
//end environments
router.get("/experiemnts", async (req, res) => {
    const client = await connectClient();
    const features = await client
        .collection("features")
        .find({ type: "exp", environment: req.query.environment, project: req.query.project })
        .toArray();
    res.send({ features: features });
});

router.get("/feature/:name", async (req, res) => {
    const client = await connectClient();
    const features = await client
        .collection("features")
        // .findOne({ name: req.params.name, environment: req.query.environment, project: req.query.project });
        .findOne({ name: req.params.name });
    res.send({ features: features });
});

router.get("/experiement/:name", async (req, res) => {
    const client = await connectClient();
    const features = await client
        .collection("features")
        // .findOne({ name: req.params.name, environment: req.query.environment, project: req.query.project });
        .findOne({ name: req.params.name });
    res.send({ features: features });
});

router.delete("/deleteFeature/:id", async (req, res) => {
    const client = await connectClient();
    const response = await client
        .collection("features")
        .deleteOne({ _id: new ObjectId(req.params.id) },
            (err, user) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(user);
            }
        );
    res.send({ response: response });
});
router.post("/createNewfeature", async (req, res) => {
    const client = await connectClient();
    console.log("createNewfeature");
    console.log("req.params");
    console.log(req.params);
    const document = await client
        .collection("features")
        .insertOne(
            {
                name: req.body.name,
                title: req.body.title,
                description: req.body.description,
                enable: req.body.enable,
                type: req.body.type,
                attributes: {
                    type: req.body.attribute_type,
                    value: req.body.attribute_value,
                },
                rules: req.body.rules,
                percentage: Number(req.body.percentage),
                dependent: req.body.dependent,
                last_modified_date: new Date(),
                end_date: req.body.end_date,
                start_date: req.body.start_date,
                environment: req.body.environment,
                project: req.body.project
            },
            { returnDocument: "after" },
            (err, user) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(user);
            }
        );
    res.send({ updatedFeature: document });
});

router.post("/createNewExperiement", async (req, res) => {
    const client = await connectClient();
    const document = await client
        .collection("features")
        .insertOne(
            {
                name: req.body.name,
                title: req.body.title,
                description: req.body.description,
                enable: req.body.enable,
                variations: req.body.variations,
                type: req.body.type,
                rules: req.body.rules,
                percentage: Number(req.body.percentage),
                dependent: req.body.dependent,
                last_modified_date: new Date(),
                end_date: req.body.end_date,
                start_date: req.body.start_date,
                environment: req.body.environment,
                project: req.body.project
            },
            { returnDocument: "after" },
            (err, user) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(user);
            }
        );
    res.send({ updatedFeature: document });
});

router.post("/feature/:name", async (req, res) => {
    const client = await connectClient();
    const document = await client
        .collection("features")
        .findOneAndUpdate({ name: req.params.name },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    enable: req.body.enable,
                    attributes: {
                        type: req.body.attribute_type,
                        value: req.body.attribute_value,
                    },
                    rules: req.body.rules,
                    percentage: Number(req.body.percentage),
                    dependent: req.body.dependent,
                    last_modified_date: new Date(),
                    end_date: req.body.end_date,
                    start_date: req.body.start_date,
                }
            },
            { returnDocument: "after" },
            (err, user) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(user);
            }
        );
    res.send({ updatedFeature: document });
});
router.post("/experiement/:id", async (req, res) => {
    const client = await connectClient();
    const document = await client
        .collection("features")
        .findOneAndUpdate({ _id: new ObjectId(req.params.id) },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    enable: req.body.enable,
                    variations: req.body.variations,
                    rules: req.body.rules,
                    percentage: Number(req.body.percentage),
                    dependent: req.body.dependent,
                    last_modified_date: new Date(),
                    end_date: req.body.end_date,
                    start_date: req.body.start_date,
                }
            },
            { returnDocument: "after" },
            (err, user) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(user);
            }
        );
    res.send({ updatedFeature: document });
});

export default router;