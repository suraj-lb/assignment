const jwt = require("jsonwebtoken");
const User = require('../model/user');
const bycrypt = require('bcryptjs')

async function signup(req, res, next) {
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) {
        return res.status(400).send({
            success: false,
            message: "Email already Exist"
        });
    }
    const salt = await bycrypt.genSalt(10);
    hashpassword = await bycrypt.hash(req.body.password, salt)
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashpassword,
        mobileNo: req.body.mobileNo,
        address: req.body.address,
    })
    try {
        const userSignup = await user.save()
        const payload = {
            user: {
                id: userSignup.id
            }
        };
        jwt.sign(payload, "project", { expiresIn: 10000 }, function (err, token) {
            if (err) {
                return res.status(400).send({
                    success: false,
                    message: err
                });
            }
            return res.status(201).send({
                success: true,
                token: token,
                data: userSignup
            });
        })
    }
    catch (err) {
        return res.status(400).send({
            success: false,
            message: err
        });
    }
}

async function login(req, res, next) {
    if (!req.body.email) {
        return res.status(400).send({
            success: false,
            message: "Email can not be empty!"
        });
    }
    if (!req.body.password) {
        return res.status(400).send({
            success: false,
            message: "Password can not be empty!"
        });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user === null) {
            return res.status(400).send({
                success: false,
                message: "User not found."
            });
        }
        else {
            let verifyPassword = await bycrypt.compare(req.body.password, user.password);
            if (verifyPassword === true) {
                const payload = {
                    user: {
                        id: user.id
                    }
                };
                let token = jwt.sign(payload, "project", { expiresIn: 10000 })
                return res.status(201).send({
                    success: true,
                    token: token,
                    data: user
                });
            }
            else {
                return res.status(400).send({
                    success: false,
                    message: "Enter correct Password"
                });
            }
        }
    }
    catch (err) {
        return res.status(400).send({
            success: false,
            message: err
        });
    }
}

async function list(req, res, next) {
    try {
        var pageNo = parseInt(req.query.pageNo)
        var size = parseInt(req.query.size)
        if (pageNo < 0 || pageNo === 0) {
            return res.status(400).send({
                success: false,
                message: "Page no start with 1",
            });
        }
        var query = {}
        query.skip = size * (pageNo - 1)
        query.limit = size
        let user = await User.find({}, {}, query)
        return res.status(200).send({
            success: true,
            message: "Successfully fetch Users record.",
            data: user
        });
    }
    catch (err) {
        return res.status(400).send({
            success: false,
            message: err
        });
    }
}

async function update(req, res, next) {
    let id = req.user.user.id;
    const userdata = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNo: req.body.mobileNo,
        address: req.body.address,
    }
    try {
        const updatedData = await User.findByIdAndUpdate(id, { $set: userdata })
        console.log(updatedData)
        return res.status(200).send({
            success: true,
            message: "User Data Updated Successfully "
        });
    }
    catch (err) {
        return res.status(400).send({
            success: false,
            message: err
        });
    }
}

async function search(req, res, next) {
    try {
        var pageNo = parseInt(req.query.pageNo)
        var size = parseInt(req.query.size)
        var keyword = { $regex: new RegExp(req.query.keyword), $options: "i" }
        if (pageNo < 0 || pageNo === 0) {
            return res.status(400).send({
                success: false,
                message: "Page no start with 1",
            });
        }
        var query = {}
        query.skip = size * (pageNo - 1)
        query.limit = size
        let searhedData = await User.find({ $or: [{ "firstName": keyword }, { "lastName": keyword }, { "email": keyword }, { "mobileNo": keyword }] }).skip(size * (pageNo - 1)).limit(size);
        console.log("searhedData", searhedData)
        return res.status(200).send({
            success: true,
            message: "Successfully fetch Users record.",
            data: searhedData
        });
    }
    catch (err) {
        return res.status(400).send({
            success: false,
            message: err
        });
    }
}

module.exports = {
    signup,
    login,
    list,
    update,
    search
}