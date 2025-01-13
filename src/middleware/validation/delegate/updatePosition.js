const { body, validationResult } = require("express-validator");
const { User, Product } = require("../../../models");
const { HttpException } = require("../../../utility/httpException");

const userPosition = async (req, res, next) => {
    const validationRules = [
        body("lat")
            .exists()
            .withMessage("lat is required.*"),


        body("long")
            .exists()
            .withMessage("long is required.*"),
         

       

   
    ];

    await Promise.all(validationRules.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
            field: error.path,
            value: error.value,
            message: error.msg,
        }));
        return res.status(422).json({
            success: false,
            message: "Validation failed",
            data: formattedErrors,
            status_code: 422,
        });
    }

    next();
};

module.exports = userPosition;