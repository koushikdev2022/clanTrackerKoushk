const express = require("express")
const updatePositionRoute = express.Router()

const delegatePositionController = require("../../controller/api/delegate/delegatePosition.controller") 
const updatePosition = require("../../middleware/validation/delegate/updatePosition")

updatePositionRoute.post("/",updatePosition,delegatePositionController.updatePosition)
updatePositionRoute.get("/data",delegatePositionController.data)


module.exports = updatePositionRoute