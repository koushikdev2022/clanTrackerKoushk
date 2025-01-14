
const { Order, OrderItems,UserAddress,Product,ProductImage,DelegateOrderMap } = require("../models");

const { Op,Sequelize } = require("sequelize")

const getAllOrders = async (delegate_id) => {
    try {
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
                               [Op.and]:[{
                                   status: 0,
                                   [Op.not]:{
                                       delegates_id:delegate_id
                                   }
                                  
                               }
                                   
                               ]
                               
                           },
                       },
                   ],
                   where: {
                       [Sequelize.Op.or]: [
                           Sequelize.literal(`
                               NOT EXISTS (
                                   SELECT 1 
                                   FROM "delegate_order_maps" AS "DelegateOrderMap"
                                   WHERE "DelegateOrderMap"."order_id" = "OrderItems"."id"
                               )
                           `),
                           Sequelize.literal(`
                                EXISTS (
                           SELECT 1 
                           FROM "delegate_order_maps" AS "DelegateOrderMap"
                           WHERE "DelegateOrderMap"."order_id" = "OrderItems"."id"
                           AND "DelegateOrderMap"."status" = 0 
                           AND "DelegateOrderMap"."delegates_id" <> ${delegate_id} 
                       )
                           `),
                       ],
                   },
                   order:[["created_at","desc"]]
                   
               });
               
        
        return orderItems;
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        throw error;
    }
};


module.exports = { getAllOrders };

