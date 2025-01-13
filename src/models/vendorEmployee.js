'use strict';
const {
  Model,
  DataTypes, Sequelize
} = require('sequelize');
const bcrypt = require('bcrypt');
let BASE_URL = process.env.SERVER_URL;
module.exports = (sequelize, DataTypes) => {
  class VendorEmployee extends Model {
   
    static associate(models) {
      
      VendorEmployee.belongsTo(models.Branch,{
        foreignKey: "branch_id",
        as: "Branch"
      });
      VendorEmployee.belongsTo(models.EmployeeRole,{
        foreignKey:"role_id",
        as:"EmployeeRole"
      })
    }
  }
  VendorEmployee.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    vendor_id: DataTypes.BIGINT,
    branch_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    emp_name: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile: DataTypes.STRING,
    address: DataTypes.TEXT,
    district:DataTypes.STRING,
    city: DataTypes.STRING,
    pincode: DataTypes.STRING,
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('avatar');
        return rawValue ? `${BASE_URL}/${rawValue}` : null;
      }
    },
    otp: DataTypes.STRING,
    otp_expired_at: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    gender: DataTypes.STRING,
    refresh_token: DataTypes.TEXT,
    hire_date: DataTypes.DATEONLY,
    is_active: DataTypes.INTEGER,
    is_deleted: DataTypes.INTEGER,
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
    modelName: 'VendorEmployee',
    tableName: 'vendor_employees',
    timestamps: false,
    underscored: true,
  });
  VendorEmployee.addHook(
      "beforeCreate",
      vendorEmployee => (vendorEmployee.password = bcrypt.hashSync(vendorEmployee.password, 10))
    );
    VendorEmployee.addHook('beforeUpdate', async (vendorEmployee) => {
    
      vendorEmployee.password = await bcrypt.hashSync(vendorEmployee.password, 10);
    
  });
  return VendorEmployee;
};