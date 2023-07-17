const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./errors/errors");
const { getEndpoints } = require("./controllers/endpoints.controllers");
const { getArticleById, getAllArticles, patchArticle } = require("./controllers/articles.controllers");
const { getAllCommentsForArticle, postNewComment, deleteComment } = require("./controllers/comments.controllers");
const { getAllUsers } = require("./controllers/users.controllers");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllCommentsForArticle);

app.get("/api/users", getAllUsers);

app.post("/api/articles/:article_id/comments", postNewComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("*", (_, res) => {
    res.status(404).send({ status: 404, msg: "Not found" });
});

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
