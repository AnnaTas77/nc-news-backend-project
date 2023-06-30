const {
    selectArticleById,
    checkArticleIdExists,
    selectAllArticles,
    updateArticle,
} = require("../models/articles.models");

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

exports.getAllArticles = (req, res, next) => {
    const { topic } = req.query;
    const { sort_by } = req.query;
    const { order } = req.query;

    selectAllArticles(topic, sort_by, order)
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        });
};

exports.patchArticle = (req, res, next) => {
    const updateVoteValueBy = req.body.inc_votes;
    const { article_id } = req.params;

    checkArticleIdExists(article_id)
        .then((exists) => {
            if (exists) {
                return updateArticle(article_id, updateVoteValueBy);
            }
        })
        .then((updatedArticle) => {
            res.status(200).send({ updatedArticle });
        })
        .catch((err) => {
            next(err);
        });
};
