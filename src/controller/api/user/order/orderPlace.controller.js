const {Order,OrderItems,Product,ProductHsn,OrderDeliveryStatus,DelegateOrderMap,ProductImage,UserAddress,sequelize,Sequelize} = require("../../../../models");
const crypto = require('crypto');

const {Op} = require("sequelize")
const generateOrderId = () => {
  const randomString = crypto.randomBytes(4).toString('hex').toUpperCase(); // Random string
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  const timestamp = Date.now(); // Current timestamp for uniqueness

  // Combine to form the order ID
  const orderId = `ORD-${randomString}-${randomNumber}-${timestamp}`;
  return orderId;
};
exports.placeOrder = async (req, res) => {
  try {
   const  delegate_id = 2
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
    return res.status(201).json({
        status: true,
        message: "Order placed successfully",
        data:orderItems,
        status_code: 201
    })
  } catch (error) {
      console.error("Error placing order:", error);
      const status = error?.status || 500;
      const message = error?.message || "INTERNAL_SERVER_ERROR";
      return res.status(status).json({
          message,
          status: false,
          status_code: status,
      });
  }
};
