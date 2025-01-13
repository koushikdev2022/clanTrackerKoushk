'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAddress extends Model {
    
    static associate(models) {
        UserAddress.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "User",
        });
        UserAddress.hasMany(models.Order,{
           foreignKey:"user_address_id",
           as:"Order"
        })
    }
  }
  UserAddress.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    user_id: DataTypes.BIGINT,
    address_type: DataTypes.STRING,
    address_line1: DataTypes.STRING,
    address_line2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    country: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
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
    modelName: 'UserAddress',
    tableName: 'user_addresses',
    timestamps: false,
    underscored: true,
  });
  return UserAddress;
};