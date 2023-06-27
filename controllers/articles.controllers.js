const { selectArticleById, checkArticleIdExists } = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    const promises = [selectArticleById(article_id)];

    if (article_id) {
        promises.push(checkArticleIdExists(article_id));
    }

    Promise.all(promises)
        .then((resolvedPromises) => {
            const article = resolvedPromises[0];
            res.status(200).send({ article });
        })
        .catch((err) => {
            next(err);
        });
};
