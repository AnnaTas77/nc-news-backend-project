const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./errors/errors");
const { getEndpoints } = require("./controllers/endpoints.controllers");
const { getArticleById } = require("./controllers/articles.controllers");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
