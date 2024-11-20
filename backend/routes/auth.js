const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');

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
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;