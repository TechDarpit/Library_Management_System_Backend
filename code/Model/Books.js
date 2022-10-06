const Sequelize = require('sequelize');
const sequelize = require('../Database/database');

// <-------------------------------------- ** Book Table Schema ** ------------------------------------------------------>

const Books = sequelize.define('books', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Title: {
        type: Sequelize.STRING
    },
    AuthorName: {
        type: Sequelize.STRING
    },
    image: {
        type: Sequelize.STRING
    },
    totalQauntity : {
        type : Sequelize.INTEGER
    },
    quantity: {
        type: Sequelize.INTEGER
    },
    Description: {
        type: Sequelize.STRING
    },
    status : {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue : 1
      }
},
    {
        createdAt: 'created-at',
        updatedAt: 'modified_at',
        paranoid: true
    });

module.exports = Books;