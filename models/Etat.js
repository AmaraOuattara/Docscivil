const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Etat = sequelize.define('tab_etat', {
 ID_etat: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  eta_reference: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  eta_libelle: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  eta_statut: {
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
  tableName: 'tab_etat'
});

module.exports = Etat;
