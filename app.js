const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { handlePsqlErrors, handleServerErrors, handleCustomErrors } = require("./errors/errors");

const app = express();

app.get("/api/topics", getAllTopics);

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
