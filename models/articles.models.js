const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticleById = (articleId) => {
    const queryString = `SELECT author, title, article_id, body, topic, created_at, votes,article_img_url FROM articles WHERE article_id=%L`;

    return db.query(format(queryString, articleId)).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 400, msg: "Bad request" });
        }
        return result.rows[0];
    });
};
