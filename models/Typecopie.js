const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Typecopie = sequelize.define('tab_typecopie', {
 ID_typecopie: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Typ_reference: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  Typ_libelle: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  Typ_statut: {
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
  tableName: 'tab_typecopie'
});

module.exports = Typecopie;
