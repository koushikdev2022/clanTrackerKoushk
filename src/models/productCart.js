'use strict';
const {
  Model,
  DataTypes,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductCart extends Model {
    
    static associate(models) {
      
      ProductCart.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "Product"
      });
      ProductCart.belongsTo(models.ProductCombination, {
        foreignKey: "combination_id",
        as: "ProductCombination"
      });
      ProductCart.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "User"
      });
    }
  }

  ProductCart.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: DataTypes.INTEGER,
    combination_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
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
    modelName: 'ProductCart',
    tableName: 'product_carts', 
    timestamps: false,
    underscored: true,
  });

  return ProductCart;
};
