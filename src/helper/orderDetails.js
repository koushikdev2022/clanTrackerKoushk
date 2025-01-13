
const { Order } = require("../models");


const getAllOrders = async () => {
    try {
        const orders = await Order.findAll();
        return orders;
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        throw error;
    }
};

module.exports = { getAllOrders };
