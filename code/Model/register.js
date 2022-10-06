const Sequelize = require("sequelize");
const sequelize = require("../Database/database");

// < ----------------------------- Schema For Register Table ---------------------------------------------------------------------->

const Register = sequelize.define(
  "register",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    createdAt: "issue_date",
    updatedAt: "modified_at",
    deletedAt: "return_at",
  }
);

module.exports = Register;
