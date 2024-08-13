const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Juridiction = sequelize.define('tab_juridiction', {
  ID_juridiction: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  jrd_reference: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  jrd_libelle: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  jrd_statut: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  date_modification: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
  
}, {
  timestamps: false,
  tableName: 'tab_juridiction'
});

module.exports = Juridiction;
