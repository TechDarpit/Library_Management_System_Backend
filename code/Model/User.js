const Sequelize = require('sequelize');

const sequelize = require('../Database/database');
// <-------------------------------- User Schema Table ----------------------------------------------->

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  mobile: Sequelize.STRING,
  gender: Sequelize.STRING,
  birthDate: Sequelize.DATE,
  role: {
    type: Sequelize.INTEGER,
    defaultValue: 2,
  },
  status : {
    type: Sequelize.DataTypes.INTEGER,
    defaultValue : 1
  }
},
  { 
    createdAt : 'created-at',
    updatedAt : 'modified_at',
    paranoid : true
  });

module.exports = User;
