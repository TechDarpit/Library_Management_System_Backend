const Sequelize = require('sequelize');
const sequelize = new Sequelize('Library_Vishal', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
