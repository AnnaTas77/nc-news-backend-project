const db = require("../db/connection");
const format = require("pg-format");

exports.selectAllCommentsForArticle = (articleId) => {
    const queryString = `SELECT comment_id, votes, created_at,author,body,article_id FROM comments WHERE article_id=%L ORDER BY comments.created_at DESC;`;

    return db.query(format(queryString, articleId)).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 200, msg: "No content" });
        }
        return rows;
    });
};

exports.insertNewComment = (articleId, newComment) => {
    const queryString = `INSERT INTO comments (body, article_id, author) 
        VALUES %L RETURNING *;`;

    const newCommentValues = [[newComment.body, articleId, newComment.username]];

    return db.query(format(queryString, newCommentValues)).then((commentFromDB) => {
        return commentFromDB.rows[0];
    });
};
