'use strict';
const {
    Model,
    DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductOffer extends Model {
        static associate(models) {
            
            ProductOffer.hasMany(models.ProductOfferMap, {
                foreignKey: 'offer_id',
                as: 'ProductOfferMap'
            });
        }
    }
    ProductOffer.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        offer_name: DataTypes.STRING,
        offer_description: DataTypes.STRING,
        start_date: {
            type: DataTypes.DATE,
        },
        end_date: {
            type: DataTypes.DATE,
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
        modelName: 'ProductOffer',
        tableName: 'product_offers',
        timestamps: false,
        underscored: true,
    });
    return ProductOffer;
};