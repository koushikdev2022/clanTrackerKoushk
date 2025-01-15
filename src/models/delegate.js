'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Delegate extends Model {
        static associate(models) {
            Delegate.hasMany(models.DelegateOrderMap,{
                foreignKey:"delegates_id",
                as:"DelegateOrderMap"
            })
        }
    }
    Delegate.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        fullname: DataTypes.STRING,
        identification_number: DataTypes.STRING,
        email: DataTypes.STRING,
        username: DataTypes.STRING,
        avatar: DataTypes.STRING,
        phone: DataTypes.STRING,
        password: DataTypes.STRING,
        country_code: DataTypes.STRING,
        status: DataTypes.INTEGER,
        is_deleted: DataTypes.INTEGER,
        is_verified: DataTypes.INTEGER,
        otp: DataTypes.INTEGER,
        otp_expired_at: DataTypes.DATE,
        latitude: DataTypes.STRING,
        longitude: DataTypes.STRING,
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
        modelName: 'Delegate',
        tableName: 'delegates',
        timestamps: false,
        underscored: true,
    });
    return Delegate
};