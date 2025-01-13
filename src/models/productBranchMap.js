'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class ProductBranchMap extends Model {

        static associate(models) {
           
        }
    }

    ProductBranchMap.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: DataTypes.INTEGER,
        branch_id: DataTypes.INTEGER,
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        }
    }, {
        sequelize,
        modelName: 'ProductBranchMap',
        tableName: 'product_branch_maps',
        timestamps: false,
        underscored: true,
    });

    return ProductBranchMap;
};
