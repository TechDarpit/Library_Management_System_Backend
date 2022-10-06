const express = require('express');
const routes = express.Router();
const AdminController = require('../controller/AdminController');
const UserController = require('../controller/Usercontroller')
const auth = require('../controller/authentication/auth');
const multer = require('multer');
const status = require('../controller/StatusController');
const { check,body} = require('express-validator/check')

// <------------------------------ Multer Configuration -------------------------------------------------->

const config = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const acceptconf = (req, file, cb) => {
        if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    }

const upload = multer({ storage: config, fileFilter: acceptconf });
// <-------------------------------- Multer config Finish ------------------------------------------------------->


// => Routes for login Admin and get JWT tocken 
routes.post('/login', AdminController.login);

// ==> Update, delete And view User
routes.get('/show-user',auth.authenticate, AdminController.showUser);

routes.put('/edit-user',
    check('name', "first name contain  minimum 3 and maximum 15").trim().isLength({ min: 3, max: 15 }),
    check('birthDate', "enter Valid BirthDate").isDate(),
    check('email', 'email is not valid').isEmail(),
    check('mobile', 'enter validPhoneNumber').optional({checkFalsy: true}).isMobilePhone(),
    check('password', "password should contain 8 letter => 1 lowercase, 1 Uppercase & atleast contain one symbol")
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
    check('gender',"Enter valid Gender Please").trim().matches("Male|Female|male|female"),
auth.authenticate, AdminController.editUser);


routes.delete('/delete-user',auth.authenticate, AdminController.deleteUser);
routes.delete('/restore',auth.authenticate, AdminController.restoreUser);
routes.get('/show-del-user',auth.authenticate, AdminController.showDelUser);



// => CRUD Opration For BOOk
//<------------------------------------- Add Book ------------------------------------------------------------------------>
routes.post('/add-book',upload.single('image'),
body('Title','title is require pls enter').trim().notEmpty(),
body('Author','author is require pls enter').trim().notEmpty(),
body('Quantity',"qauntity is must needed and also start from 1 ").trim().isInt({min:1}),
body('Description','Description have atleast 5 letter').trim().optional({checkFalsy: true}).isLength({min :5 }),
auth.authenticate,  AdminController.addBook);
routes.get('/show-book',auth.authenticate,AdminController.showBook);
routes.delete('/delete-book',auth.authenticate,AdminController.deleteBook);

// <---------------------------------- Update book validation ------------------------------------------------------------->
routes.put('/update-book',
upload.single('image'),
body('Title','title is require pls enter').notEmpty(),
body('Author','author is require pls enter').notEmpty(),
body('Quantity',"qauntity is must needed and also start from 1 ").isInt({min:1}),
body('Description','Description have atleast 5 letter').optional({checkFalsy: true}).isLength({min :5 }),AdminController.editBook);
// <---------------------------------- restore book validation ------------------------------------------------------------->
routes.get('/restore-book',auth.authenticate,AdminController.restoreBook);
routes.get('/deleted-books',auth.authenticate,AdminController.showDelBooks)


// => showing user-Book Register aka Issued_book table
routes.get('/show-register',auth.authenticate,AdminController.BookRegister);


//=> changing Status Of User 
routes.get('/active-user',auth.authenticate,status.active);
routes.get('/deactive-user',auth.authenticate,status.inactive);
routes.get('/deactive-user-show',auth.authenticate,status.inActivateUser)
routes.get('/show-active-user',auth.authenticate,status.activateUser)


module.exports = routes;