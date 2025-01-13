'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');

let BASE_URL = process.env.SERVER_URL;

module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    
    static associate(models) {
      
      ProductImage.belongsTo(models.Product,{
        foreignKey:"product_id",
        as:"Product"
      })
    }
  }
  ProductImage.init({
    product_id: {
      type:DataTypes.BIGINT,
      references:{
        model: "Product",
        key: "id",
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('image');
        return rawValue ? `${BASE_URL}/${rawValue}` : null;
      }
    },
    priority: {
      type:DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_primary: {
      type:DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type:DataTypes.INTEGER,
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
    modelName: 'ProductImage',
    tableName: 'product_images',
    timestamps: false,
    underscored: true,
  });
  return ProductImage;
};