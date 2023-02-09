require('dotenv').config();
const Sequelize = require('sequelize');

const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const USER_NAME = process.env.DB_USER_NAME;
const PASSWORD = process.env.DB_PASSWORD;

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
});

module.exports = sequelize;
