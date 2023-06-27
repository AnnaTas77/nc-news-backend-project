const fs = require("fs/promises");

exports.getEndpoints = (req, res, next) => {
    return fs
        .readFile(`${__dirname}/../endpoints.json`)
        .then((fileContents) => {
            const contentsToString = fileContents.toString();
            const endpoints = JSON.parse(contentsToString);
            return endpoints;
        })
        .then((endpoints) => {
            res.status(200).send({ endpoints });
        })
        .catch((err) => {
            next(err);
        });
};
