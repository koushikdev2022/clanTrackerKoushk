'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shelves extends Model {
    
    static associate(models) {
      
    }
  }
  Shelves.init({
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    shelf_number: DataTypes.STRING,
    location_description: DataTypes.STRING,
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
    modelName: 'Shelves',
    tableName: 'shelves',
    timestamps: false,
    underscored: true,
  });
  return Shelves;
};