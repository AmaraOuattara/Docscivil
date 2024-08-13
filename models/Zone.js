const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Zone = sequelize.define('tab_zone', {
 ID_zone: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  zne_reference: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  zne_libelle: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  zne_statut: {
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
  tableName: 'tab_zone'
});

module.exports = Zone;
