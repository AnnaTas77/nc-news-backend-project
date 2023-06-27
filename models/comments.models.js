const db = require("../db/connection");
const format = require("pg-format");

exports.checkArticleIdExists = (articleId) => {
    const queryString = `SELECT comment_id, votes, created_at,author,body,article_id FROM comments WHERE article_id=%L ORDER BY comments.created_at DESC;`;

    return db.query(format(queryString, articleId)).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Not found" });
        }
    });
};

exports.selectAllCommentsForArticle = (articleId) => {
    const queryString = `SELECT comment_id, votes, created_at,author,body,article_id FROM comments WHERE article_id=%L ORDER BY comments.created_at DESC;`;

    return db.query(format(queryString, articleId)).then(({ rows }) => {
        return rows;
    });
};
