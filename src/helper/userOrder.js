const { Order, OrderItems,UserAddress,Product,ProductImage,DelegateOrderMap,Delegate } = require("../models");

const { Op,Sequelize } = require("sequelize")

const userOrder = async (user_id) => {
    try {
      
        const userDetails =  await DelegateOrderMap.findAll({
            include:[{
                model:Delegate,
                as:"Delegate",
                require:false
            },{
                model:OrderItems,
                as:"OrderItems",
                require:false,
                include:[{
                    model:Product,
                    as:"Product",
                    require:false
                },{
                    model:Order,
                    as:"Order",
                    require:false,
                    include:[{
                        model:UserAddress,
                        as:"UserAddress",
                        require:false
                    }]
                }]
            }],
            where:{
                user_id:user_id,
                status:{[Op.in]:[1,2]}
            },
            order:[['created_at','DESC']]
        }) 
        return userDetails;
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        throw error;
    }
};


module.exports = { userOrder };