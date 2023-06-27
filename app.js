const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./errors/errors");
const { getEndpoints } = require("./controllers/endpoints.controllers");
const { getArticleById, getAllArticles } = require("./controllers/articles.controllers");
const { getAllCommentsForArticle } = require("./controllers/comments.controllers");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllCommentsForArticle);

app.all("*", (_, res) => {
    res.status(404).send({ status: 404, msg: "Not found" });
});

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
