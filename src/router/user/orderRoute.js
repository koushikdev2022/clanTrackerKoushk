const express = require("express");
const orderRoute = express.Router();

const orderPlaceController = require("../../controller/api/user/order/orderPlace.controller")
const orderPlaceValidation = require("../../middleware/validation/user/orderPlaceValidation")
const isUserAuthenticateMiddleware = require("../../middleware/auth/user/isUserAuthenticateMiddleware")

orderRoute.post("/place-order",isUserAuthenticateMiddleware,orderPlaceValidation,orderPlaceController.placeOrder)

module.exports = orderRoute;