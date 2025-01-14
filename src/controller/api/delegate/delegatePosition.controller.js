const {Delegate,OrderItems,Order,Product,ProductImage,DelegateOrderMap,UserAddress} = require("../../../models")
const {Sequelize,Op} = require("sequelize")
const {findDelevaryFunction} = require("../../../helper/findDelevaryFunction")
exports.updatePosition = async (req,res) =>{
    try{
        // const delegate_id = req?.user?.id
        // const lat = req?.body?.lat
        // const long = req?.body?.long

        // const delegateDetails = await Delegate.findByPk(delegate_id)
        // const update= delegateDetails.update({
        //     latitude:lat,
        //     longitude:long
        // })
        // if(update){
        //       res.status(200).json({
        //             status:true,
        //             status_code:200,
        //             message:"update successfully"
        //       })
        // }else{
        //     res.status(400).json({
        //         status:false,
        //         status_code:400,
        //         message:"not updated still now"
        //   })
        // }
        const delegate_id = req?.user?.id
        const offset = (1-1)*10
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
        
        
        
                    return res.status(200).json({
                        data:orderItems
                    })
    }catch (error) {
        console.error("Error in get send:", error);
        const status = error?.status || 400;
        const message = error?.message || "INTERNAL_SERVER_ERROR";
        return res.status(status).json({
            message,
            status: false,
            status_code: status,
        });
    }
        

        
}


exports.data = async (req,res) =>{
        const data = findDelevaryFunction()
}