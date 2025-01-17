'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItems extends Model {
    
    static associate(models) {
      OrderItems.belongsTo(models.Order,{
        foreignKey:"order_id",
        as:"Order"
      })
      OrderItems.belongsTo(models.Product,{
        foreignKey:"product_id",
        as:"Product"
      })
      OrderItems.hasMany(models.DelegateOrderMap,{
        foreignKey:"order_id",
        as:"DelegateOrderMap"
      })
    }
  }
  OrderItems.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    product_hsn_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    unit_price: DataTypes.DECIMAL,
    gross_price: DataTypes.DECIMAL,
    tax_amount: DataTypes.DECIMAL,
    net_price: DataTypes.DECIMAL,
    is_free: DataTypes.INTEGER,
    custom_order_id: DataTypes.STRING,
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
    modelName: 'OrderItems',
    tableName: 'order_items',
    timestamps: false,
    underscored: true,
  });
  return OrderItems;
};