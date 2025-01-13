'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCombination extends Model {
    
    static associate(models) {
      
      ProductCombination.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "Product"
      });
      ProductCombination.hasMany(models.ProductCombinationAttribute, {
        foreignKey: "combination_id",
        as: "ProductCombinationAttribute"
      })
      
      ProductCombination.hasMany(models.ProductOfferMap, {
        foreignKey: "combination_id",
        as: "ProductOfferMap"
      });
      
      ProductCombination.hasMany(models.ProductOfferMap, {
        foreignKey: "free_combination_id",
        as: "ProductOfferMapForFreeCombination"
      });
    }
  }
  ProductCombination.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: DataTypes.BIGINT,
    combination_sku: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    is_active: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
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
    modelName: 'ProductCombination',
    tableName: 'product_combinations',
    timestamps: false,
    underscored: true,
  });
  return ProductCombination;
};