const db = require("../db/connection");
const format = require("pg-format");

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
        return rows;
    });
};
