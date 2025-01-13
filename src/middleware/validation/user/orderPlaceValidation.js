const { body, validationResult } = require("express-validator");
const { User, Product } = require("../../../models");
const { HttpException } = require("../../../utility/httpException");

const placeOrderValidation = async (req, res, next) => {
    const validationRules = [
        body("user_address_id")
            .exists()
            .withMessage("User address ID is required.*")
            .isInt()
            .withMessage("User address ID must be an integer.*"),

        body("delivery_mode")
            .exists()
            .withMessage("Delivery mode is required.*")
            .isString()
            .withMessage("Delivery mode must be a string.*"),

        // body("delivery_charges")
        //     .exists()
        //     .withMessage("Delivery charges are required.*")
        //     .isNumeric()
        //     .withMessage("Delivery charges must be a numeric value.*"),

        body("payment_status")
            .exists()
            .withMessage("Payment status is required.*")
            .isInt()
            .withMessage("Payment status must be a string.*"),

        body("order_type")
            .exists()
            .withMessage("Order type is required.*")
            .isString()
            .withMessage("Order type must be a string.*"),

        body("products")
            .exists()
            .withMessage("Products are required.*")
            .isArray()
            .withMessage("Products must be an array.*")
            .custom((value) => {
                value.forEach((product, index) => {
                    if (!product.product_id || !product.quantity || !product.unit_price) {
                        throw new Error(`Product at index ${index} is missing required fields (product_id, quantity, unit_price).`);
                    }
                    if (isNaN(product.quantity) || product.quantity <= 0) {
                        throw new Error(`Product at index ${index} must have a valid quantity.`);
                    }
                    if (isNaN(product.unit_price) || product.unit_price <= 0) {
                        throw new Error(`Product at index ${index} must have a valid unit_price.`);
                    }
                });
                return true;
            }),

        // body("products.*.product_id")
        //     .custom(async (product_id) => {
        //         const product = await Product.findByPk(product_id);
        //         if (!product) {
        //             throw new HttpException(400, `Product with ID ${product_id} not found.*`);
        //         }
        //         return true;
        //     }),
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

module.exports = placeOrderValidation;
