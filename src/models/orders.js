'use strict';
const {
    Model,
    DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class Order extends Model {
        static associate(models) {
            Order.hasMany(models.OrderItems,{
                foreignKey:"order_id",
                as:"OrderItems"
            })
            Order.belongsTo(models.User,{
                foreignKey:"user_id",
                as:"User"
            })
            Order.belongsTo(models.Vendor,{
                foreignKey:"vendor_id",
                as:"Vendor"
            })
            Order.belongsTo(models.UserAddress,{
                foreignKey:"user_address_id",
                as:"UserAddress"
              })
        }
    }
    Order.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user_id: DataTypes.INTEGER,
        order_type: DataTypes.STRING,
        order_date: DataTypes.DATE,
        delivery_mode: DataTypes.STRING,
        delivery_charges: DataTypes.DECIMAL,
        total_price: DataTypes.DECIMAL,
        user_address_id: DataTypes.INTEGER,
        payment_status: DataTypes.INTEGER,
        vendor_id: DataTypes.BIGINT,
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: false,
        underscored: true,
    });
    return Order;
};