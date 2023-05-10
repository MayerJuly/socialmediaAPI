const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {check, validationResult} = require("express-validator")
const jwt = require("jsonwebtoken");
const {secret} = require("../config");
const authMiddleware = require("../midleware/authMiddleware")

// Login


const generateAccessToken = (_id, username) => {
    const payload = {
        _id,
        username
    }

    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            res.status(400).json({message:"Wrong Email"});
            return;
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) {
            res.status(400).json({message:"Wrong password"});
            return;
        }
        const token = generateAccessToken(user._id, user.username);
        const userData = {_id: user._id, username: user.username}
        return res.json({token, user: userData})
    } catch (err) {
        res.status(500).json(err);
    }


})

router.get('/logout', authMiddleware, async (req, res) => {
    try {
        return res.status(200).json('logout')
    } catch (err) {
        res.status(500).json(err);
    }


})


router.post('/check', authMiddleware, async (req, res) => {
    try {
        return res.status(200).json({user: req.user})
    } catch (err) {
        res.status(500).json(err);
    }


})


// Register

router.post("/register", [
    check('username', 'Username cant be empty').notEmpty(),
    check('name', 'Name cant me empty').notEmpty(),
    check('surname', 'Surname cant me empty').notEmpty(),
    check('email', 'Адрес электронной почты не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 и меньше 20 символов').isLength({min:3,max:10})

], async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({message: "Ошибка при регистрации", errors})
        }
        // generate password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);



        // create new user

        const newUser = new User({
            username: req.body.username,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: hashedPassword,

        })

        //save user
        const user = await newUser.save();
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router
