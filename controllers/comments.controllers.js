const { checkArticleIdExists } = require("../models/articles.models");
const { selectAllCommentsForArticle, insertNewComment } = require("../models/comments.models");

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

    checkArticleIdExists(article_id)
        .then((exists) => {
            if (exists) {
                insertNewComment(article_id, newComment)
                    .then((commentFromDB) => {
                        res.status(201).send({ postedComment: commentFromDB });
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
