const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    if (password !== passwordConfirmation) {
        console.log("Password " + password + " does not match " + passwordConfirmation);
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ email, password: hashedPassword });
        res.status(201).json({ message: 'Registration successful', user: newUser });
        console.log("New user with email " + email + " created and passowrd " + password + " hashed to " + hashedPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Attempt recieved with " + email + " and " + password);

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Comparing form password " + password + " with hashed password " + user.password + " and result is " + isMatch);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;