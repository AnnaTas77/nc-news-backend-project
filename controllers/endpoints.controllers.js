const { selectEndpoints } = require("../models/endpoints.models");

exports.getEndpoints = (req, res, next) => {
    selectEndpoints()
        .then((endpoints) => {
            res.status(200).send({ endpoints });
        })
        .catch((err) => {
            next(err);
        });
};
