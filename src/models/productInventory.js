'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductInventory extends Model {
    
    static associate(models) {
      
    }
  }
  ProductInventory.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    product_id: DataTypes.INTEGER,
    combination_id: DataTypes.INTEGER,
    shelf_id: DataTypes.INTEGER,
    stock_quantity: DataTypes.INTEGER,
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
    modelName: 'ProductInventory',
    tableName: 'product_inventories',
    timestamps: false,
    underscored: true,
  });
  return ProductInventory;
};