const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Commune = sequelize.define('tab_commune', {
  id_commune: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ref_commune: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  commune: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  date_modification: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  statut: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'tab_commune'
});

module.exports = Commune;
