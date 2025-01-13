'use strict';
const {
    Model,
    DataTypes, Sequelize
} = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    
    class Admin extends Model {
        static associate(models) {
    
        }
    }
    Admin.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        password: DataTypes.STRING,
        avatar: DataTypes.STRING,
        full_name:DataTypes.STRING,
        latitude: DataTypes.STRING,
        longitude: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        role_id:DataTypes.BIGINT,
        postal_code: DataTypes.STRING,
        country: DataTypes.STRING,
        identity_number: DataTypes.STRING,
        nationality: DataTypes.STRING,
        otp: DataTypes.INTEGER,
        otp_expired_at: DataTypes.DATE,
        refresh_token: DataTypes.TEXT,
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
        modelName: 'Admin',
        tableName: 'admins',
        timestamps: false,
        underscored: true,
    });
    Admin.addHook(
        "beforeCreate",
        admin => (admin.password = bcrypt.hashSync(admin.password, 10))
      );
    Admin.addHook('beforeUpdate', async (admin) => {
       
            admin.password = await bcrypt.hashSync(admin.password, 10);
       
    });
    return Admin;
};