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

exports.topicExists = (topic) => {
    const queryString = format(`SELECT slug FROM topics WHERE slug=%L`, topic);
    return db.query(queryString).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Not found" });
        }
    });
};

exports.selectAllArticles = (topic, sortBy, order) => {
    if (topic) {
        return this.topicExists(topic).then(() => {
            return selectAllArticlesInternal(topic, sortBy, order);
        });
    } else {
        return selectAllArticlesInternal(topic, sortBy, order);
    }
};

const selectAllArticlesInternal = (topic, sortBy = "created_at", order = "desc") => {
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

    if (!validSortByValues.includes(sortBy)) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    if (!validOrderValues.includes(order)) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id `;

    if (topic) {
        queryString += `WHERE articles.topic=%L `;
    }

    queryString += `GROUP BY articles.article_id ORDER BY articles.%I %s;`;

    let finalQueryString;
    if (topic) {
        finalQueryString = format(queryString, topic, sortBy, order);
    } else {
        finalQueryString = format(queryString, sortBy, order);
    }

    return db.query(finalQueryString).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Not found" });
        } else {
            return rows;
        }
    });
};

exports.updateArticle = (articleId, updateVoteValueBy) => {
    const queryString = `UPDATE articles SET votes=votes+%L WHERE article_id=%L RETURNING *;`;

    return db.query(format(queryString, updateVoteValueBy, articleId)).then(({ rows }) => {
        return rows[0];
    });
};
