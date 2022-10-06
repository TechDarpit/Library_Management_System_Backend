const register = require("../Model/register");
const Books = require("../Model/Books");
const User = require("../Model/User");
const Register = require("../Model/register");
const jwt = require("jsonwebtoken");
const jwtKey = "SuperSecretKey";
const _ = require("lodash");
const { Op } = require("sequelize");
const Book = require("../Model/Books");
const { search } = require("../routes/admin");
const { validationResult } = require("express-validator");
const multiparty = require("multiparty");
const sequelize = require("sequelize");
exports.issueBooks = async (req, res) => {
  try {
    const id = req.cookies.id;
    console.log(id);
    const BookId = req.body.Bookid;
    const total = await register
      .findAll({ where: { UserId: id } })
      .then()
      .catch((err) => console.log(err));
    const BookData = await Books.findOne({ where: { id: BookId } });
    newqaun = BookData.quantity - 1;
    const BookName = BookData.Title;
    if (BookData.quantity > 0 && total.length <= 3) {
      console.log("--------->");
      const registerBook = await register
        .create({ UserId: id, bookId: BookId })
        .then((result) => {
          Books.update({ quantity: newqaun }, { where: { id: BookId } });
          res.send(`Book was issued to ${id}`);
        })
        .catch((err) => {
          res.send(`you have alredy  ${BookName}`);
          console.log(err);
        });
    }
    res.send("exceeded limit of issueing😔");
  } catch {
    res.send("book hi nahi hai kaha se du???");
  }
};

exports.showBook = (req, res) => {
  let limit = parseInt(req.body.item_per_page);
  const filterValue = req.body.filterValue;
  const columname = req.body.columname;
  const orderBy = req.body.orderBy;
  Book.findAndCountAll().then((data) => {
    req.query.page;
    let page = req.body.page;
    let pages = Math.ceil(data.count / limit);
    offset = limit * (page - 1);
    Book.findAll({
      where: {
        [Op.or]: [
          sequelize.where(sequelize.col("Title"), {
            [Op.like]: `%${filterValue}%`,
          }),
          sequelize.where(sequelize.col("authorName"), {
            [Op.like]: `%${filterValue}%`,
          }),
          sequelize.where(sequelize.col("Description"), {
            [Op.like]: `%${filterValue}%`,
          }),
        ],
      },

      order: [[`${columname}`, `${orderBy}`]],
      attributes: ["id", "Title", "authorName"],
      limit: limit,
      offset: offset,
    })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => res.send(err));
  });
};
