const express = require('express');
const multer = require('multer');
const { Image } = require('../models');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const newImage = await Image.create({ path: req.file.path });
        res.status(201).json({ message: 'Image uploaded successfully', image: newImage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;