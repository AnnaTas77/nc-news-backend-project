const db = require("../db/connection");
const format = require("pg-format");

exports.checkCommentIdExists = (commentId) => {
    const queryString = `SELECT * FROM comments WHERE comment_id=%L;`;

    return db.query(format(queryString, commentId)).then((rows) => {
        if (!rows.rowCount) {
            return Promise.reject({ status: 404, msg: "Not found" });
        } else {
            return true;
        }
    });
};

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

exports.removeComment = (commentId) => {
    const queryString = `DELETE FROM comments WHERE comment_id=%L RETURNING *;`;

    return db.query(format(queryString, commentId)).then(({ rows }) => {
        return rows;
    });
};
