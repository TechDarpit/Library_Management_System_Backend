// <----------------------------- Dependency ---------------------------------------------------------------->
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const sequelize = require("./Database/database");
const User = require("./Model/User");
const Books = require("./Model/Books");
const register = require("./Model/register");
require("dotenv").config();


//<-------------------------------- app Start ------------------------------------------------------------>
const app = express();
//<------------------------------ Setting App ------------------------------------------------------------>
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static("images"));
app.use("/images", express.static("images"));
//<-------------------------------- Server start on port 3000 --------------------------------------------->

app.listen(3000);

// < ------------------------------ Request to the routes for Admin ---------------------------------------->
app.use("/admin", adminRoutes);

// <-------------------------------- Request to the Routes for User/Student -------------------------------->
app.use("/user", userRoutes);

// <------------------------------ Assosiation -------------------------------------------------------------->

User.hasMany(register, { foreingKey: "userId" });
Books.hasMany(register, { foreingKey: "BookId" });
register.belongsTo(User, { foreingKey: "userId" });
register.belongsTo(Books, { foreingKey: "BookId" });

// <------------------------------- Sequelize setting and starting ---------------------------------------->
sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });
