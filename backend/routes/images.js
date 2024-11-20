const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { Image } = require('../models');
const authMiddleware = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded' });
    }
    try {
        const image = await Image.create({ path: `/uploads/${req.file.filename}` });
        console.log("Image saved on path " + image.path);
        res.status(200).send(image);
    } catch (error) {
        console.log("Failed to save image " + error);
        res.status(500).send({ error: 'Failed to save image' });
    }
});

router.get('/', async (req, res) => {
    try {
        const images = await Image.findAll();
        res.status(200).send(images);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch images' });
    }
});

// Expose the uploads folder
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;