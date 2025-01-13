'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderPayment extends Model {
    
    static associate(models) {
     
    }
  }
  OrderPayment.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    order_id: DataTypes.INTEGER,
    payment_method: DataTypes.STRING,
    transaction_id: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    payment_status: DataTypes.STRING,
    remarks: DataTypes.TEXT,
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
    modelName: 'OrderPayment',
    tableName: 'order_payments',
    timestamps: false,
    underscored: true,
  });
  return OrderPayment;
};