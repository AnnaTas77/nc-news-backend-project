const { checkArticleIdExists } = require("../models/articles.models");
const { selectAllCommentsForArticle } = require("../models/comments.models");

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
