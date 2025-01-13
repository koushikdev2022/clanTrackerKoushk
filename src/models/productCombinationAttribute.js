'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCombinationAttribute extends Model {
    
    static associate(models) {
      
      ProductCombinationAttribute.belongsTo(models.ProductCombination,{
             foreignKey:"combination_id",
             as:"ProductCombination"
      });
    }
  }
  ProductCombinationAttribute.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
    combination_id: DataTypes.BIGINT,
    attribute_name: DataTypes.STRING,
    attribute_value: DataTypes.STRING,
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
    modelName: 'ProductCombinationAttribute',
    tableName: 'product_combination_attributes',
    timestamps: false,
    underscored: true,
  });
  return ProductCombinationAttribute;
};