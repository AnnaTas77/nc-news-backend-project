const db = require("../db/connection");
const format = require("pg-format");

exports.checkUsernameExists = (username) => {
    const queryString = `SELECT username FROM users WHERE username=%L;`;

    return db.query(format(queryString, username)).then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Not found" });
        } else {
            return true;
        }
    });
};

exports.selectAllUsers = () => {
    const queryString = `SELECT * FROM users;`;

    return db.query(queryString).then(({ rows }) => {
        return rows;
    });
};
