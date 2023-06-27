const db = require("../db/connection");
const format = require("pg-format");

exports.checkArticleIdExists = (articleId) => {
    return db
        .query(
            format(
                `SELECT author, title, article_id, body, topic, created_at, votes,article_img_url FROM articles WHERE article_id=%L`,
                articleId
            )
        )
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not found" });
            }
        });
};

exports.selectArticleById = (articleId) => {
    const queryString = `SELECT author, title, article_id, body, topic, created_at, votes,article_img_url FROM articles WHERE article_id=%L`;

    return db.query(format(queryString, articleId)).then((result) => {
        return result.rows[0];
    });
};
