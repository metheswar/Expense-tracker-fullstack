const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('metheswar', 'root', 'Methi@2304', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+05:30',
  });

  module.exports = sequelize;