const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Localite = sequelize.define('tab_localite', {
 ID_localite: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  loc_reference: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  loc_libelle: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  loc_statut: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  pay_reference: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Zne_reference: {
    type: DataTypes.STRING(100),
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
  tableName: 'tab_localite'
});

module.exports = Localite;
