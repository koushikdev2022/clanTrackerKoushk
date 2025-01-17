const { Sequelize } = require('sequelize');
require('dotenv').config();

const { Client } = require('pg');

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_CLIENT = process.env.DB_CLIENT;
const DB_HOST = process.env.DB_HOST;


const pgClient = new Client({
    user: DB_USERNAME,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: process.env.DB_HOST || 5432,
  });

module.exports = {pgClient}