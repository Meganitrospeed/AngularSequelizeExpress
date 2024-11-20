const { Sequelize } = require('sequelize');
const config = require('./config.json');
const UserModel = require('../models/User');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize({
    dialect: dbConfig.dialect,
    storage: dbConfig.storage
});

const User = UserModel(sequelize, Sequelize.DataTypes);

console.log('Before sequelize.sync()');

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch((error) => {
        console.error('Error creating database & tables:', error);
    });

console.log('After sequelize.sync()');

module.exports = {
    sequelize,
    User
};