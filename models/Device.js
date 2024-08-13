const {DataTypes}   = require('sequelize');
const sequelize     = require('../config/database.js');

const Device = sequelize.define('tab_device', {
    push_indice: {
       type :  DataTypes.INTEGER,
       autoIncrement: true,
       primaryKey: true
    },
    push_user : {
        type : DataTypes.STRING(50),
        unique : true,
        allowNull : false
    },
    push_token : {
        type : DataTypes.CHAR.BINARY,
        unique : true,
        allowNull : false

    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }

}
, {
    timestamps: false,
    tableName: 'tab_device'
  }
);

module.exports = Device;