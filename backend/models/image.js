'use strict';
module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        path: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return Image;
};