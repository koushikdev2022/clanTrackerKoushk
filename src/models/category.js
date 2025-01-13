'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(Category, {
        as: 'Subcategories',
        foreignKey: 'parent_id',
      });

      Category.belongsTo(Category, {
        as: 'ParentCategory',
        foreignKey: 'parent_id',
      });

      Category.hasMany(models.Product, {
        foreignKey: "category_id",
        as: "Category"
      })
    }
  }
  Category.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: DataTypes.STRING,
    category_type: DataTypes.STRING,
    parent_id: DataTypes.BIGINT,
    thumbnail: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('thumbnail');
        return rawValue ? `${process.env.SERVER_URL}/${rawValue}` : null;
      }
    },
    banner: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('banner');
        return rawValue ? `${process.env.SERVER_URL}/${rawValue}` : null;
      }
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
    modelName: 'Category',
    tableName: 'categories',
    timestamps: false,
    underscored: true,
  
  });
  return Category;
};