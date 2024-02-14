
const express = require('express')
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator')
const User = require('../models/users')
const nodemailer = require('nodemailer')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Mailgen = require('mailgen');
const auth = require('../middleware/auth');
const asyncHandler = require('express-async-handler')


router.post('/register', [
    check('name', "first name is required").not().isEmpty(),
    check('email', "please include a valid email").isEmail(),
    check('password', "password must contain at least 8 characters").isLength({ min: 8 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { name, email, password, address, role } = req.body;

        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ errors: [{ msg: "user already exists" }] })
        }

        const utilisateur = { name, email, password, address, role }
        const activation_token = createActivationToken(utilisateur);
        const url = `http://localhost:3000/activationemail/${activation_token}`

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 465,
            secure: false,
            auth: {
                user: 'traorebakary2002@gmail.com',
                pass: 'aoathpoyzgmrcyir'
            }
        })

        await transporter.sendMail({
            from: 'traorebakary2002@gmail.com',
            to: email,
            subject: 'verify mail',
            html:
                `<div>
            <p><strong>Hello ${name}</strong></p>
            <p>You registered an account to our app before being able to use your account</p>
            <p>you need to verify that this is your email address by clicking here:</p>
            <a href=${url}><button style="background-color:#609966; display:inline-block; padding:20px; width:200px;color:#ffffff;text-align:center;" >Click here</button></a>
            <br />
            <p>Kind Regards</p>
          </div>`
        })

        res.status(200).json({ msg: "please activate your account" })

    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
})
const createActivationToken = (payload) => {
    return jwt.sign(payload, "mysecrettoken", { expiresIn: '5m' });
};


router.post(`/activationemail`, async (req, res) => {
    try {
        const { activation_token } = req.body;
        const user = jwt.verify(activation_token, "mysecrettoken");


        const { name, email, password, address, role } =
            user;

        const utilisateur = await User.findOne({ email })


        const newUser = new User({
            name,
            email,
            password,
            address,
            role: "UTILISATEUR"
        });
        const salt = await bcrypt.genSalt(10)

        newUser.password = await bcrypt.hash(password, salt)

        await newUser.save();

        const payload = {
            newUser: {
                id: newUser.id
            }
        }

        jwt.sign(payload, "mysecrettoken", { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        })


        res.json({ msg: 'Your account has been activated' });
    } catch (err) {
        res.status(500).json(err.message);
    }
}
)

router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        ///See if user does not  exists
        let utilisateur = await User.findOne({ email })
        if (!utilisateur) {
            return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] })
        }

        ////Check if password match
        const isMatch = bcrypt.compareSync(password, utilisateur.password)
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] })
        }

        ////Return  jsonwebtoken
        const payload = {
            utilisateur: {
                id: utilisateur.id,
                role: utilisateur.role,
                name: utilisateur.name
            }
        }
        jwt.sign(payload, "mysecrettoken", { expiresIn: 3600 }, (err, token) => { if (err) throw err; res.json({ firstName: utilisateur.firstName, token, role: utilisateur.role }) });

    }
    catch (err) {
        console.log(err.message);
        res.status(500).send('Server error')
    }



})

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.utilisateur.id).select('-password')
        res.json(user)

    } catch (error) {
        res.status(500).json({ msg: error.message })

    }
})

router.post('/logout', (req, res) => {
    res.cookie('token', "", { expires: new Date(0) });
    res.status(200).json({ msg: "user logged out" })
})


router.put('/updateProfile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.utilisateur.id)
        if (user) {
            user.name = req.body.name || user.name
            user.lastName = req.body.lastName || user.lastName
            user.address = req.body.address || user.address

            const updatedUser = await user.save()
            res.status(200).json({
                id: updatedUser.id,
                name: updatedUser.name,
                address: updatedUser.address,
            })
        }
        else {
            res.status(404).json({ msg: "user not found" })
        }

    } catch (error) {
        res.status(500).json({ msg: "user not found " })

    }
})


module.exports = router;