const express = require("express");
const router = express.Router();


const orderRoute = require("../user/orderRoute")

const defaultRoutes = [
    {
        prefix: "/order",
        route: orderRoute,
    },
  
]
defaultRoutes.forEach((route) => {
    if (route.middleware) {
        router.use(route.prefix, route.middleware, route.route);
    } else {
        router.use(route.prefix, route.route);
    }
});

module.exports = router;