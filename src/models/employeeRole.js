'use strict';

const { Model, DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class EmployeeRole extends Model {

        static associate(models) {
            EmployeeRole.hasMany(models.VendorEmployee,{
                foreignKey:"role_id",
                as:"VendorEmployee"
            })
        }
    }
    EmployeeRole.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        role_name: DataTypes.STRING,
        description: DataTypes.TEXT,
        is_active: DataTypes.INTEGER,
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
        modelName: 'EmployeeRole',
        tableName: 'employee_roles',
        timestamps: false,
        underscored: true,
    });
    return EmployeeRole;
};