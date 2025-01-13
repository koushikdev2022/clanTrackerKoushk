'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Barcodes extends Model {
    static associate(models) {
    }
  }
  Barcodes.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    product_id: DataTypes.INTEGER,
    combination_id: DataTypes.INTEGER,
    barcode: DataTypes.STRING,
    is_primary: DataTypes.BOOLEAN,
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
    modelName: 'Barcodes',
    tableName: 'barcodes',
    timestamps: false,
    underscored: true,
  });
  return Barcodes;
};