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
                include:[{
                    model:Product,
                    as:"Product"
                }]
            }],
            where:{
                user_id:id
            }
        }) 
        
        return userDetails;
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        throw error;
    }
};


module.exports = { userOrder };