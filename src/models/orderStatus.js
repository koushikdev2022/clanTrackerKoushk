'use strict';
const {
    Model,
    DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    
    class OrderStatus extends Model {
        static associate(models) {

        }
    }
    OrderStatus.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: DataTypes.STRING,
        is_active: DataTypes.INTEGER,
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
        modelName: 'OrderStatus',
        tableName: 'order_status',
        timestamps: false,
        underscored: true,
    });
    return OrderStatus;
};