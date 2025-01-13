'use strict';
const {
    Model,
    DataTypes, Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Branch extends Model {
        static associate(models) {
            Branch.belongsTo(models.Vendor, {
                foreignKey: "vendor_id",
                as: "Vendor"
            });
            Branch.hasMany(models.VendorEmployee,{
                foreignKey: "branch_id",
                as: "VendorEmployee"
            })
            Branch.belongsToMany(models.Product, {
                foreignKey: "branch_id",
                as: "products",
                through:models.ProductBranchMap
            });
        }
    }
    Branch.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        vendor_id: DataTypes.INTEGER,
        branch_name: DataTypes.STRING,
        serial_number: DataTypes.STRING,
        emp_volume: DataTypes.INTEGER,
        latitude: DataTypes.STRING,
        longitude: DataTypes.STRING,
        preparation_time: DataTypes.INTEGER,
        delivery_free: DataTypes.DECIMAL,
        is_active: DataTypes.INTEGER,
        created_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        type: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Branch',
        tableName: 'branches',
        timestamps: false,
        underscored: true,
    });
    return Branch;
};