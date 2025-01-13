const express = require("express");
const router = express.Router();


const userLoad = require("./user/userLoad")
const vendorLoad = require("./vendor/vendorLoad")
const delegateLoad = require("./delegate/delegateLoad")

const defaultRoutes = [
    {
        prefix: "/user",
        route: userLoad,
    },
    {
        prefix: "/vendor",
        route: vendorLoad,
    },
    {
        prefix: "/delegate",
        route: delegateLoad,
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