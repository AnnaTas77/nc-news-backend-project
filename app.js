const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { handleServerErrors } = require("./errors/errors");

const app = express();

app.get("/api/topics", getAllTopics);

app.use(handleServerErrors);

module.exports = app;
