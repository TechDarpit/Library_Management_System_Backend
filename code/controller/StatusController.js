const user = require('../Model/User');
const Books = require('../Model/Books');
const { Op } = require("sequelize");

exports.active = async (req, res) => {
    try {
        const id = req.id;
        const active = await user.update({ status: 1 }, { where: { id: id } });
        console.log(active[0])
        if(active[0] === 1)
        {
            res.send("user activated")
        }
        else
        {
            res.send('user alredy Active')
        }
    }
    catch(error) {
        res.send(error)
    }
};

exports.inactive = async (req, res) => {
    try {
        const id = req.id;
        const inactive = await user.update({ status: 2 }, { where: { id: id } });
        res.send("user inactive")
    }
    catch {
        res.send("user is alredy inactive")
    }
}

// <---------------------------------------- Show Active User ---------------------------------------------------->
exports.activateUser = (req, res) => {
    const filterValue = 1;
    const columname = 'status'
    user.findAndCountAll()
        .then((data) => {
            user.findAll({
                where: {
                    [columname]: {
                        [Op.like]: `${filterValue}%`,
                    },
                },
               
            }).then((result) => {
                res.send(result)
            }).catch(err => res.send(err));
        })
}


// <---------------------------------------- Show inActive user ---------------------------------------------------->
exports.inActivateUser = (req, res) => {
    const filterValue = 2;
    const columname = 'status'
    user.findAndCountAll()
        .then((data) => {
            user.findAll({
                where: {
                    [columname]: {
                        [Op.like]: `${filterValue}%`,
                    },
                },

            }).then((result) => {
                res.send(result)
            }).catch(err => res.send(err));
        })
}