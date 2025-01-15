'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class DelegateOrderMap extends Model {
        static associate(models) {
            DelegateOrderMap.belongsTo(models.OrderItems,{
                foreignKey:"order_id",
                as:"OrderItems"
            })
            DelegateOrderMap.belongsTo(models.Delegate,{
                foreignKey:"delegates_id",
                as:"Delegate"
            })
            DelegateOrderMap.belongsTo(models.User,{
                foreignKey:"user_id",
                as:"User"
            })
        }
    }
    DelegateOrderMap.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_id: DataTypes.INTEGER,
        delegates_id: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'DelegateOrderMap',
        tableName: 'delegate_order_maps',
        timestamps: false,
        underscored: true,
    });
    return DelegateOrderMap;
};
