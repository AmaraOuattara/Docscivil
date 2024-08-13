const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prospect = sequelize.define('tab_prospect', {
  Id_clt: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clt_reference: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clt_nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clt_prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clt_civilite: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clt_contact: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lst_reference: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Statut_client: {
    type: DataTypes.STRING,
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
  tableName: 'tab_prospect',
  timestamps: false
});

Prospect.associate = function(models) {
  Prospect.belongsTo(models.tab_listediffusion, {
    foreignKey: 'lst_reference',
    targetKey: 'lst_reference'
  });
};


module.exports = Prospect;
