const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Listediffusion = sequelize.define('tab_listediffusion', {
  lst_Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lst_reference: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lst_libelle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lst_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Usr_reference: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Statut_liste: {
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
  tableName: 'tab_listediffusion',
  timestamps: false
});

Listediffusion.associate = function(models) {
  Listediffusion.hasMany(models.tab_prospect, {
    foreignKey: 'lst_reference',
    sourceKey: 'lst_reference'
  });
};

module.exports = Listediffusion;
