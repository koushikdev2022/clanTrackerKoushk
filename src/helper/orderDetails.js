
const { Order, OrderItems,UserAddress,Product,ProductImage,DelegateOrderMap } = require("../models");

const { Sequelize } = require("sequelize")

const getAllOrders = async () => {
    try {
        // Use Sequelize query to exclude mapped items in OrderDelegateMap
            const orderItems = await OrderItems.findAll({
                include: [
                    {
                        model: Order,
                        as: "Order",
                        required: false,
                        include: [
                            {
                                model: UserAddress,
                                as: "UserAddress",
                                required: false,
                            },
                        ],
                    },
                    {
                        model: Product,
                        as: "Product",
                        required: false,
                        include: [
                            {
                                model: ProductImage,
                                as: "ProductImage",
                                required: false,
                            },
                        ],
                    },
                    {
                        model: DelegateOrderMap,
                        as: "DelegateOrderMap",
                        required: false, 
                        where: {
                            status: 0, 
                        },
                    },
                ],
                where: {
                    [Sequelize.Op.or]: [
                        { 
                            "$DelegateOrderMap.id$": null 
                        },
                        {
                            "$DelegateOrderMap.status$": 0 
                        }
                    ],
                },
            });
            return orderItems;
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        throw error;
    }
};


module.exports = { getAllOrders };

