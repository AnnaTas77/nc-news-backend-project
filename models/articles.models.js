const { query } = require("express");
const db = require("../db/connection");
const format = require("pg-format");

exports.checkArticleIdExists = (articleId) => {
    const queryString = `SELECT author, title, article_id, body, topic, created_at, votes,article_img_url FROM articles WHERE article_id=%L;`;

    return db.query(format(queryString, articleId)).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Not found" });
        } else {
            return true;
        }
    });
};

exports.selectArticleById = (articleId) => {
    const queryString = `SELECT author, title, article_id, body, topic, created_at, votes,article_img_url FROM articles WHERE article_id=%L;`;

    return db.query(format(queryString, articleId)).then((result) => {
        return result.rows[0];
    });
};

exports.selectAllArticles = (topic, sortBy = "created_at", order = "desc") => {
    const validTopics = ["mitch", "cats", "paper"];
    const validSortByValues = [
        "author",
        "title",
        "article_id",
        "topic",
        "votes",
        "article_img_url",
        "comment_count",
        "created_at",
    ];
    const validOrderValues = ["asc", "desc"];

    if (topic && !validTopics.includes(topic)) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    if (!validSortByValues.includes(sortBy)) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    if (!validOrderValues.includes(order)) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

    if (topic) {
        queryString += `WHERE articles.topic='${topic}' `;
    }

    queryString += `GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url ORDER BY articles.${sortBy} ${order.toUpperCase()};`;

    return db.query(queryString).then(({ rows }) => {
        return rows;
    });
};

exports.updateArticle = (articleId, updateVoteValueBy) => {
    const queryString = `UPDATE articles SET votes=votes+%L WHERE article_id=%L RETURNING *;`;

    return db.query(format(queryString, updateVoteValueBy, articleId)).then(({ rows }) => {
        return rows[0];
    });
};
