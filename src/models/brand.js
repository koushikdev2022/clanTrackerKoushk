'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
      Brand.hasMany(models.Product,{
        foreignKey:"brand_id",
        as:"Brand"
      })
    }
  }
  Brand.init({
    brand_name: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    banner: DataTypes.STRING,
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
    modelName: 'Brand',
    tableName: 'brands',
    timestamps: false,
    underscored: true,
  });
  return Brand;
};