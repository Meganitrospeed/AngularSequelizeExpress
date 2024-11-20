// backend/models/image.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Image = sequelize.define('Image', {
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return Image;
};