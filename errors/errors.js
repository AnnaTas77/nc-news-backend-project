exports.handleServerErrors = (err, req, res, next) => {
    console.log(err, "<---- Error from Server.");

    res.status(500).send({ msg: "I am broken..." });
};
