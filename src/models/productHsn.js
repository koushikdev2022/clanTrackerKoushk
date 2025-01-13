'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductHsn extends Model {
    
    static associate(models) {
      
      ProductHsn.hasMany(models.Product,{
        foreignKey:"product_hsn_id",
        as:"ProductHsn"
      })
    }
  }
  ProductHsn.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    hsn_code: DataTypes.STRING,
    percentage: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
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
    modelName: 'ProductHsn',
    tableName: 'product_hsns',
    timestamps: false,
    underscored: true,
  });
  return ProductHsn;
};