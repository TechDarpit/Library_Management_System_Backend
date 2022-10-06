const express = require("express");
const routes = express.Router();
const UserController = require("../controller/Usercontroller");
const auth = require("../controller/authentication/userAuth");
const { check } = require("express-validator/check");
routes.get("/", (req, res) => {
  res.json("home Page");
});
const BookController = require("../controller/BookController");
const { route } = require("./admin");
const status = require("../controller/StatusController");

// for register ==> 3000/user/register

routes.post(
  "/register",
  check("name", "first name contain  minimum 3 and maximum 15")
    .trim()
    .isLength({ min: 3, max: 15 }),
  check("birthDate", "enter Valid BirthDate").isDate(),
  check("email", "email is not valid").isEmail(),
  check("mobile", "enter validPhoneNumber")
    .optional({ checkFalsy: true })
    .isMobilePhone(),
  check(
    "password",
    "password should contain 8 letter => 1 lowercase, 1 Uppercase & atleast contain one symbol"
  ).isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  check("gender", "Enter valid Gender Please").matches(
    "Male|Female|male|female"
  ),

  UserController.register
);

//for User Login ==> 3000/user/login

routes.post(
  "/login",
  check("email", "email is not valid").isEmail(),
  UserController.login
);
routes.get("/history", auth.authenticate, UserController.showHistory);
routes.post("/issueBook", auth.authenticate, UserController.issueBooks);
routes.post("/return-book", auth.authenticate, UserController.returnBook);

// =>  changing status of User
routes.get("/active-user", auth.authenticate, status.active);
routes.get("/deactive-user", auth.authenticate, status.inactive);
routes.get("/show-book", auth.authenticate, BookController.showBook);
routes.get("/show-book-detail", auth.authenticate, UserController.BookDetail);

module.exports = routes;
