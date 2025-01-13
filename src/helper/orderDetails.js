
const { Order, OrderItems,UserAddress,Product,ProductImage } = require("../models");

const getAllOrders = async () => {
    try {
        // Directly reference the OrderItems model
        const orderItems = await OrderItems.findAll({
            include:[{
                model:Order,
                as:"Order",
                required:false,
                include:[{
                    model:UserAddress,
                    as:"UserAddress",
                    required:false,
                }]
            },{
                model:Product,
                as:"Product",
                include:[{
                    model:ProductImage,
                    as:"ProductImage",
                    required:false,
                }]
            }]
        });
        return orderItems;
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        throw error;
    }
};

module.exports = { getAllOrders };

