const { checkArticleIdExists } = require("../models/articles.models");
const { selectAllCommentsForArticle } = require("../models/comments.models");

exports.getAllCommentsForArticle = (req, res, next) => {
    const { article_id } = req.params;

    const promises = [selectAllCommentsForArticle(article_id)];

    if (article_id) {
        promises.push(checkArticleIdExists(article_id));
    }

    Promise.all(promises)
        .then((resolvedPromises) => {
            const comments = resolvedPromises[0];
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
};
