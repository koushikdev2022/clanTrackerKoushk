'use strict';
const {
    Model,
    DataTypes, Sequelize
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    
    class Vendor extends Model {
        static associate(models) {
            Vendor.hasMany(models.Branch, {
                foreignKey: "vendor_id",
                as: "Branch"
              })
            Vendor.hasMany(models.Product,{
                foreignKey:"vendor_id",
                as:"Products"
            })
            Vendor.hasMany(models.Order,{
                foreignKey:"vendor_id",
                as:"Order"
            })
        }
    }
    Vendor.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        mobile_no: DataTypes.STRING,
        password: DataTypes.STRING,
        avatar: DataTypes.STRING,
        company_name: DataTypes.STRING,
        commercial_registry: DataTypes.STRING,
        number_of_branches: DataTypes.INTEGER,
        latitude: DataTypes.DECIMAL,
        longitude: DataTypes.DECIMAL,
        address: DataTypes.STRING,
        license_number: DataTypes.STRING,
        owner_id: DataTypes.STRING,
        otp: DataTypes.STRING,
        otp_expired_at: DataTypes.DATE,
        is_approved: DataTypes.INTEGER,
        approved_date: DataTypes.DATE,
        is_active: DataTypes.INTEGER,
        refresh_token: DataTypes.TEXT,
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
        modelName: 'Vendor',
        tableName: 'vendors',
        timestamps: false,
        underscored: true,
    });
    // Vendor.addHook(
    //     "beforeCreate",async (vendor) => {
    //         console.log(vendor.password)
    //         vendor.password = await hashPassword(vendor.password);
    //         console.log(vendor.password)
    // });
    // Vendor.addHook('beforeUpdate', async (vendor) => {
    //         vendor.password = await bcrypt.hash(vendor.password, 10);
    // });
    return Vendor;
};