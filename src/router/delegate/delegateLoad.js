const express = require("express");
const router = express.Router();


const updatePositionRoute = require("./updatePositioRoute")
const isDelegateAuthenticateMiddleware = require("../../middleware/auth/delegate/isDelegateAuthenticateMiddleware")

const defaultRoutes = [
    {
        prefix: "/update-position",
        route: updatePositionRoute,
        middleware:isDelegateAuthenticateMiddleware
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