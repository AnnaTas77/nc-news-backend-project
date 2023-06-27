const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { handleServerErrors } = require("./errors/errors");
const { getEndpoints } = require("./controllers/endpoints.controllers");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.use(handleServerErrors);

module.exports = app;
