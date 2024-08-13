const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('etatcivilci', 'root', '', {
  host: 'localhost',
  dialect: 'mysql' // ou 'mysql', 'sqlite', etc.
});

module.exports = sequelize;
