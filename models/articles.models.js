const db = require("../db/connection");
const format = require("pg-format");

exports.checkArticleIdExists = (articleId) => {
    const queryString = `SELECT author, title, article_id, body, topic, created_at, votes,article_img_url FROM articles WHERE article_id=%L;`;

    return db.query(format(queryString, articleId)).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Not found" });
        }
    });
};

exports.selectArticleById = (articleId) => {
    const queryString = `SELECT author, title, article_id, body, topic, created_at, votes,article_img_url FROM articles WHERE article_id=%L;`;

    return db.query(format(queryString, articleId)).then((result) => {
        return result.rows[0];
    });
};

exports.selectAllArticles = () => {
    const queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`;

    return db.query(queryString).then(({ rows }) => {
        return rows;
    });
};
