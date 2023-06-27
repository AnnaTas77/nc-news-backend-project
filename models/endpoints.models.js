const fs = require("fs/promises");

exports.selectEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`).then((fileContents) => {
        const contentsToString = fileContents.toString();
        const endpoints = JSON.parse(contentsToString);
        return endpoints;
    });
};
