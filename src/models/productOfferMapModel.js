'use strict';
const {
    Model,
    DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductOfferMap extends Model {
        static associate(models) {
            
            ProductOfferMap.belongsTo(models.ProductOffer, {
                foreignKey: "offer_id",
                as: "ProductOffer",
            });
            
            ProductOfferMap.belongsTo(models.Product, {
                foreignKey: "product_id",
                as: "Product",
            });
            
            ProductOfferMap.belongsTo(models.Product, {
                foreignKey: "free_product_id",
                as: "FreeProduct",
            });
            
            ProductOfferMap.belongsTo(models.ProductCombination, {
                foreignKey: "combination_id",
                as: "ProductCombination",
            });
            
            ProductOfferMap.belongsTo(models.ProductCombination, {
                foreignKey: "free_combination_id",
                as: "FreeCombination",
            });
        }
    }
    ProductOfferMap.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        offer_id: {
            type: DataTypes.BIGINT,
        },
        product_id: {
            type: DataTypes.BIGINT,
        },
        combination_id: {
            type: DataTypes.BIGINT,
        },
        
        offer_type: DataTypes.STRING,
        discount_value: {
            type: DataTypes.DECIMAL,
        },
        min_quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: "Minimum quantity required when offer_type 'buy_one_get_one' or somethik like this"
        },
        free_product_id: {
            type: DataTypes.BIGINT,
        },
        free_combination_id: {
            type: DataTypes.BIGINT,
        },
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
        modelName: 'ProductOfferMap',
        tableName: 'product_offers_maps',
        timestamps: false,
        underscored: true,
    });
    return ProductOfferMap;
};