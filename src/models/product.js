'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    
    static associate(models) {
      
      Product.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        as: "Brand"
      })
      Product.belongsTo(models.Vendor, {
        foreignKey: "vendor_id",
        as: "vendors"
      })
      Product.belongsTo(models.ProductHsn, {
        foreignKey: "product_hsn_id",
        as: "ProductHsn"
      })
      Product.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "Category"
      })
      Product.belongsTo(models.Unit, {
        foreignKey: "unit_id",
        as: "Unit"
      })
      Product.hasMany(models.ProductImage, {
        foreignKey: "product_id",
        as: "ProductImage"
      })
      Product.hasMany(models.ProductCombination, {
        foreignKey: "product_id",
        as: "ProductCombination"
      })
      Product.hasMany(models.ProductOfferMap, {
        foreignKey: "product_id",
        as: "ProductOfferMap"
      });
      Product.hasMany(models.ProductOfferMap, {
        foreignKey: "free_product_id",
        as: "ProductOfferMapForFreeProduct"
      });
      Product.hasMany(models.ProductCart, {
        foreignKey: "product_id",
        as: "ProductCart"
      });
      Product.belongsToMany(models.Branch, {
        foreignKey: "product_id",
        as: "branches",
        through:models.ProductBranchMap
      });
      Product.hasMany(models.OrderItems,{
        foreignKey:"product_id",
        as:"OrderItems"
      })
    }
  }
  Product.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    product_name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    discount_price: DataTypes.DECIMAL,
    brand_id: {
      type: DataTypes.BIGINT,
    },
    category_id: {
      type: DataTypes.BIGINT,
    },
    unit_id: {
      type: DataTypes.BIGINT,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
    },
    serial_number: {
      type: DataTypes.STRING,
    },
    item_number: {
      type: DataTypes.STRING,
    },
    main_shelf: {
      type: DataTypes.STRING,
    },
    shelf: {
      type: DataTypes.STRING,
    },
    sub_shelf: {
      type: DataTypes.STRING,
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
    },
    production_date: {
      type: DataTypes.DATEONLY,
    },
    published_date: {
      type: DataTypes.DATEONLY,
    },
    is_combinable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    product_hsn_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    tax_apply: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: 'Product',
    tableName: 'products',
    timestamps: false,
    underscored: true,
  });
  return Product;
};