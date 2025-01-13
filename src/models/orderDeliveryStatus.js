'use strict';
const {
    Model,
    DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    
    class OrderDeliveryStatus extends Model {
        static associate(models) {

        }
    }
    OrderDeliveryStatus.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        order_id: DataTypes.INTEGER,
        order_item_id: DataTypes.INTEGER,
        order_status_id: DataTypes.INTEGER,
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
        modelName: 'OrderDeliveryStatus',
        tableName: 'order_delivery_status',
        timestamps: false,
        underscored: true,
    });
    return OrderDeliveryStatus;
};