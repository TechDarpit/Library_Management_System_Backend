const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");

require("dotenv").config();
const jwtKey = process.env.TOKEN_ADMIN_SECRET;
const user = require("../Model/User");
const bcrypt = require("bcrypt");
const Book = require("../Model/Books");
const register = require("../Model/register");
const User = require("../Model/User");
const Books = require("../Model/Books");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

//  <-------------------  Login API ------------------------------>
exports.login = (req, res) => {
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
          const email1 = result.email;
          const dbpass = result.password;
          const conf = bcrypt.compareSync(password, dbpass);
          if (conf && role === 1) {
            const token = jwt.sign({ id, role, email1 }, jwtKey);
            return res.status(200).json({
              message: "Logged in successfully 😊👌",
              data: { ...result, token },
            });
          } else {
            res.json("password is invalid Or U are not a admin");
          }
        })
        .catch((error) => {
          res.send("admin does not exist");
        });
    })
    .catch((error) => {
      res.send(error);
    });
};

// < --------------------------  Add Book ------------------------------------->
exports.addBook = async (req, res) => {
  const error = validationResult(req);

  if (error.isEmpty()) {
    const Title = req.body.Title;
    const Author = req.body.Author;
    const Image = req.file.path;
    const Quantity = req.body.Quantity;
    const Description = req.body.Description;
    const bookexist = await Book.findOne({
      where: {
        Title: Title,
        AuthorName: Author,
      },
      raw: true,
    });
    console.log(bookexist);
    if (bookexist) {
      res.send(`${bookexist.Title} is exist `);
    } else {
      Book.create({
        Title: Title,
        AuthorName: Author,
        image: Image,
        quantity: Quantity,
        totalQauntity: Quantity,  
        Description: Description,
      })
        .then((result) => {
          res.json({ message: "Book Addded SuccessFull 📕📕", data: result });
        })
        .catch((err) => console.log(err));
    }
  } else {
    err = error.array();
    errormessage = [];
    err.forEach((x) => {
      errormessage.push(x.msg);
    });
    res.send(errormessage);
    console.log(errormessage);
  }
};

// <-------------------------------------------- Delete Book ---------------------------------------------------------------->
exports.deleteBook = async (req, res) => {
  try {
    const delBookVal = await Book.findOne({
      where: { id: req.body.id },
      raw: true,
    });
    const totalQauntity = delBookVal.totalQauntity;
    const currentQauntity = delBookVal.quantity;
    if (totalQauntity === currentQauntity) {
      const deelete = await Book.update(
        { status: 3 },
        { where: { id: req.body.id } }
      )
        .then()
        .catch((err) => console.log(err));
      const gettter = await Book.destroy({
        where: { id: req.body.id },
        paranoid: false,
      });
      if (gettter) {
        res.send({ message: "book was Deleted Successfully", data: gettter });
      } else {
        res.send({ message: "book not found" });
      }
    } else {
      res.send({ Message: "maybe somewhere book is issued" });
    }
  } catch (error) {
    res.send({ msg: "Book Not FOund" });
  }
};
//<--------------------------------------------- Restore Book ---------------------------------------------------------------->

exports.restoreBook = async (req, res) => {
  const gettter = await Books.restore({
    where: {
      id: req.body.id,
    },
  });
  if (gettter) {
    const update = await Books.update(
      { status: 1 },
      { where: { id: req.body.id } }
    )
      .then()
      .catch((err) => console.log(err));
    res.send("Book restore ");
  } else {
    res.send("Book not Found ");
  }
};
//<------------------------------------------- Show Books --------------------------------------------------------------------->

exports.showBook = (req, res) => {
  let limit = parseInt(req.body.item_per_page); // number of records per page
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
      limit: limit,
      offset: offset,
    })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => res.send(err));
  });
};
// <----------------------------------------------- Show deleted Books ---------------------------------------------------------->
exports.showDelBooks = (req, res) => {
  Books.findAll({
    where: { deletedAt: { [Op.ne]: null } },
    paranoid: false,
  })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => res.send(err));
};
// <------------------------------------------- Edit Book ----------------------------------------------------------------------->

exports.editBook = async (req, res) => {
  try {
    const id = req.body.id;
    console.log("id: ", id);

    const { Title, AuthorName, Quantity, Description } = req.body;
    const image = req.file.path;
    console.log("Image: ", image);
    const updatevalue = {
      Title,
      AuthorName,
      Quantity,
      Description,
      image,
    };
    const bookCheck = await Book.findOne({ where: { id: id } });
    if (bookCheck) {
      const result = await Book.update(updatevalue, { where: { id: id } });

      const updatedBook = await Book.findOne({ where: { id: id } });
      res.send({
        message: `Book Updated sucessFully ${result}`,
        data: updatedBook,
      });
    } else {
      res.send({ message: "there is not a such book like" });
    }
  } catch (error) {
    res.send("error in update ");
  }
};

// <-------------------------------------------------- User-show ---------------------------------------------------------------->

exports.showUser = (req, res) => {
  let limit = parseInt(req.body.item_per_page); 
  let offset = 0;
  const filterValue = req.body.filterValue;
  const columname = req.body.columname;
  const orderBy = req.body.orderBy;
  User.findAndCountAll().then((data) => {
    req.query.page;
    let page = req.body.page;
    let pages = Math.ceil(data.count / limit);
    offset = limit * (page - 1);
    User.findAll({
      where: {
        [Op.or]: [
          sequelize.where(sequelize.col("name"), {
            [Op.like]: `%${filterValue}%`,
          }),
          sequelize.where(sequelize.col("email"), {
            [Op.like]: `%${filterValue}%`,
          }),
        ],
      },
      order: [[`${columname}`, `${orderBy}`]],
      limit: limit,
      offset: offset,
    })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => res.send(err));
  });
};

//  <------------------------------------------ Show deleted User ---------------------------------------------------------------->
exports.showDelUser = (req, res) => {
  User.findAll({
    where: { deletedAt: { [Op.ne]: null } },
    // paranoid: false
  })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => res.send(err));
};
// <------------------------------------------------ Edit User ------------------------------------------------------------------->

exports.editUser = async (req, res) => {
  const id = req.body.id;
  const us = await User.findOne({ where: { id: id } });
  if (us) {
    const result = await User.update(req.body, { where: { id: id } });
    if (result) {
      res.send("updated successfully");
    } else {
      res.send("not Updated");
    }
  } else {
    res.send("user not Found");
  }
};

// <--------------------------------------------------- Delete User ----------------------------------------------------------------->

exports.deleteUser = async (req, res) => {
  const deelete = await User.update(
    { status: 3 },
    { where: { id: req.body.id } }
  )
    .then()
    .catch((err) => console.log(err));
  const gettter = await User.destroy({
    where: {
      id: req.body.id,
    },
  });
  if (gettter) {
    res.send({ message: "User Deleted SuccessFully", id: req.body.id });
  } else {
    res.send({ message: "user not Found ", User: gettter });
  }
};

// <---------------------- Restore delete user --------------------------------------------------------------->

exports.restoreUser = async (req, res) => {
  const gettter = await User.restore({
    where: {
      id: req.body.id,
    },
  });
  if (gettter) {
    const update = await User.update(
      { status: 1 },
      { where: { id: req.body.id } }
    );
    res.send("User restore ");
  } else {
    res.send("user was not deleted ");
  }
};

// <<---------------------------------------------- user-Book Showing API -------------------------------------->>

exports.BookRegister = async (req, res) => {
  const filterValue = req.body.filterValue;
  const columname = req.body.columname;
  const orderBy = req.body.orderBy;
  let limit = parseInt(req.body.item_per_page);
  let offset = 0;
  let page = req.body.page;
  offset = limit * (page - 1);
  User.findAll({
    where: {
      [Op.or]: [
        sequelize.where(sequelize.col("name"), {
          [Op.like]: `%${filterValue}%`,
        }),
        sequelize.where(sequelize.col("email"), {
          [Op.like]: `%${filterValue}%`,
        }),
      ],
    },
    order: [[`${columname}`, `${orderBy}`]],
    attributes: ["name", "email"],
    include: {
      model: register,
      attributes: ["id", "return_at"],
      paranoid: false,
      include: {
        model: Books,
        attributes: ["Title", "AuthorName", "image", "Description"],
      },
    },
    limit: limit,
    offset: offset,
  })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
};
