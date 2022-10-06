const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
require("dotenv").config();
const register = require("../Model/register");
const Books = require("../Model/Books");
const User = require("../Model/User");
const user = require("../Model/User");
const Register = require("../Model/register");
const bcrypt = require("bcrypt");
const jwtKey = process.env.TOKEN_USER_SECRET;
const { validationResult } = require("express-validator/check");

// <--------------------- Register API -------------------------------------->

exports.register = async (req, res) => {
  try {
    const error = validationResult(req);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const mobile = req.body.mobile;
    const gender = req.body.gender;
    const birthDate = req.body.birthDate;
    const hash = bcrypt.hashSync(password, 12);
    if (error.isEmpty()) {
      const useremail = await user
        .findOne({ where: { email: email } })
        .catch((err) => console.log(err));
      if (useremail) {
        res.json({ Message: "user alredy exist", data: useremail });
      } else {
        const created = await user.create({
          name: name,
          email: email,
          password: hash,
          mobile: mobile,
          gender: gender,
          birthDate: birthDate,
        });
        if (created) {
          res.json({ Message: "Register SuccessFull 😅😅 ", data: created });
        } else {
          res.json("Something went wrong to register pls try again 😭 ");
        }
      }
    } else {
      err = error.array();
      errormessage = [];
      err.forEach((x) => {
        errormessage.push(x.msg);
      });

      res.send(errormessage);
    }
  } catch (error) {
    res.send(error);
  }
};

//  <-------------------  Login API ------------------------------>
exports.login = (req, res) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      user
        .sync()
        .then(() => {
          user
            .findOne({ where: { email: email }, raw: true })
            .then((result) => {
              const role = result.role;
              const id = result.id;
              const dbpass = result.password;
              const email = result.email;
              const conf = bcrypt.compareSync(password, dbpass);
              if (conf) {
                const token = jwt.sign({ id, role, email }, jwtKey);
                return res.json({
                  message: "Logged in successfully 😊👌",
                  data: { ...result, token },
                });
              } else {
                res.json("password is invalid");
              }
            })
            .catch((error) => {
              res.json("User is not Registered : 🥺");
            });
        })
        .catch((error) => {
          console.error(
            "Unable to Connect with Database Please Try Again Letter :(😩):"
          );
        });
    } catch (error) {
      res.send(error);
    }
  } else {
    err = error.array();
    errormessage = [];
    err.forEach((x) => {
      errormessage.push(x.msg);
    });
    res.send(errormessage);
  }
};

// <--------------------------- showing  Book -------------------------------------------->
exports.showHistory = async (req, res) => {
  const id = req.id;
  let limit = parseInt(req.body.item_per_page); 
  let page = req.body.page;
  offset = limit * (page - 1);
  try {
    data = await user.findOne({
      where: { id: id },
      attributes: ["name", "email"],
      include: {
        model: register,
        attributes: ["id", "return_at"],
        paranoid: false,
        include: {
          model: Books,
          attributes: ["id", "Title", "AuthorName", "image", "Description"],
        },
        limit: limit,
        offset: offset,
      },
    });
    res.send(data);
  } catch {
    res.send("error");
  }
};

// <--------------------------- Issue Book ----------------------------------------------------------------->

exports.issueBooks = async (req, res) => {
  try {
    const id = req.id;

    const BookId = req.body.Bookid;
    const total = await register
      .findAll({ where: { UserId: id } })
      .then()
      .catch((err) => console.log(err));
    const BookData = await Books.findOne({ where: { id: BookId } })
      .then()
      .catch((err) => console.log(err));
    const username = await User.findOne({ where: { id: id } })
      .then()
      .catch((err) => console.log(err));
    const newqaun = BookData.quantity - 1;
    const alredyBook = await register.findOne({
      where: { UserId: id, bookId: BookId },
      raw: true,
    });
    const BookName = BookData.Title;
    if (!alredyBook) {
      if (BookData.quantity > 0 && total.length < 3) {
        const registerBook = await register
          .create({ UserId: id, bookId: BookId })
          .then((result) => {
            Books.update({ quantity: newqaun }, { where: { id: BookId } });
            res.send({ message: `Book was issued `, data: BookData });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.send({ message: "Book is not available " });
      }
    } else {
      res.send({ message: ` you  have alredy  Book`, data: BookData });
    }
  } catch (error) {
    res.send("Book not found");
  }
};

exports.returnBook = async (req, res) => {
  const Bookid = req.body.id;
  const id = req.id;

  const result = await User.findOne({ where: { id: id } });
  if (result) {
    const checkBook = await Books.findOne({
      where: { id: Bookid },
    });
    if (checkBook) {
      const register = await Register.findOne({
        where: { BookId: Bookid, UserId: result.id },
      });
      if (!register) {
        res.send("Book not issued....!");
      }
      const d = new Date();
      const date = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate();
      const returnBook = await Register.destroy({ where: { id: register.id } });

      const adjustQuantity = await Books.update(
        { quantity: checkBook.quantity + 1 },
        { where: { id: checkBook.id } }
      );

      res.send("Returned Book Successfully....!");
    } else {
      res.send("This book is not available in database");
    }
  } else {
    res.send(`you dont have ${Bookid} `);
  }
};

// <----------------------------------------- Book Detail ------------------------------------------------------------->

exports.BookDetail = (req, res) => {
  let limit = parseInt(req.body.item_per_page);
  const filterValue = req.body.filterValue;
  const columname = req.body.columname;
  const orderBy = req.body.orderBy;
  const bookId = req.body.bookId;
  Books.findAndCountAll().then((data) => {
    req.query.page;
    let page = req.body.page;
    let pages = Math.ceil(data.count / limit);
    offset = limit * (page - 1);
    Books.findAll({
      where: {
        id: bookId,
      },
      attributes: ["id", "Title", "image", "quantity", "Description"],
    })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => res.send(err));
  });
};
