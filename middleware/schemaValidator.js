const { validationResult, checkSchema } = require("express-validator");

function checkValidity(req, res, next) {
    const validation = validationResult(req);

    if (!validation.isEmpty()) {
        return res.status(422).json(validation.array());
    }

    next();
}

module.exports = function (schema) {
    return [
   
        checkSchema(schema),

        checkValidity,
    ];
};

module.exports.checkValidity = checkValidity;