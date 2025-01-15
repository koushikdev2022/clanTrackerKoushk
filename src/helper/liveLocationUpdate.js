const { Order, OrderItems,UserAddress,Product,ProductImage,DelegateOrderMap,Delegate } = require("../models");

const { Op,Sequelize } = require("sequelize")

const liveLocationUpdate = async (id) => {
    try {
        const locationUpdateDelegate = [];
        const locationUpdate = await DelegateOrderMap.findOne({
            include:[{
                model:Delegate,
                as:"Delegate",
                attributes:['fullname','avatar','latitude','longitude']
            }],
            where:{
                id:id
            }
        })
        locationUpdateDelegate.push(locationUpdate?.Delegate)
        return locationUpdateDelegate;
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        throw error;
    }
};


module.exports = { liveLocationUpdate };