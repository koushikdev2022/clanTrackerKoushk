'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    
    static associate(models) {
      
      Unit.hasMany(models.Product,{
        foreignKey:"unit_id",
        as:"Unit"
      })
    }
  }
  Unit.init({
    unit_name: {
      type: DataTypes.STRING,
      comment: 'kg, liters, pieces, etc', 
    },
    unit_description: DataTypes.STRING,
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
    modelName: 'Unit',
    tableName: 'units',
    timestamps: false,
    underscored: true,
  });
  return Unit;
};