'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class EmployeeBranchMap extends Model {

        static associate(models) {
            
        }
    }

    EmployeeBranchMap.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employee_id: DataTypes.INTEGER,
        branch_id: DataTypes.INTEGER,
        remarks: DataTypes.TEXT,
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        }
    }, {
        sequelize,
        modelName: 'EmployeeBranchMap',
        tableName: 'employee_branch_maps',
        timestamps: false,
        underscored: true,
    });

    return EmployeeBranchMap;
};
