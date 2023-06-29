const { checkArticleIdExists } = require("../models/articles.models");
const { selectAllCommentsForArticle, insertNewComment } = require("../models/comments.models");
const { checkUsernameExists } = require("../models/users.models");

exports.getAllCommentsForArticle = (req, res, next) => {
    const { article_id } = req.params;

    checkArticleIdExists(article_id)
        .then((exists) => {
            if (exists) {
                selectAllCommentsForArticle(article_id)
                    .then((comments) => {
                        res.status(200).send({ comments });
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
        })
        .catch((err) => {
            next(err);
        });
};

exports.postNewComment = (req, res, next) => {
    const { article_id } = req.params;
    const newComment = req.body;
    const { username } = newComment;

    checkArticleIdExists(article_id)
        .then((exists) => {
            if (exists) {
                return checkUsernameExists(username);
            } else {
                return Promise.reject({ status: 404, msg: "Not found" });
            }
        })
        .then((exists) => {
            if (exists) {
                return insertNewComment(article_id, newComment);
            } else {
                return Promise.reject({ status: 404, msg: "Not found" });
            }
        })
        .then((commentFromDB) => {
            res.status(201).send({ postedComment: commentFromDB });
        })
        .catch((err) => {
            next(err);
        });
};
