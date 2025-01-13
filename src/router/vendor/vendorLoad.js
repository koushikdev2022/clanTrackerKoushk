const express = require("express");
const router = express.Router();


const vendorOrderRoute = require("../vendor/vendorOrderRoute")

const defaultRoutes = [
    {
        prefix: "/vendor-order",
        route: vendorOrderRoute,
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