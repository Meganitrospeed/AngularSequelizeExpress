const jwt = require('jsonwebtoken');
const secretKey = 'your_jwt_secret'; // Replace with your actual secret key

module.exports = (req, res, next) => {
    // const token = req.headers['authorization'];
    // if (!token) {
    //     console.log("Unathorized request");
    //     return res.status(401).send({ error: 'Unauthorized' });
    // }
    //
    // jwt.verify(token, secretKey, (err, decoded) => {
    //     if (err) {
    //         console.log("Failed to authenticate token " + token + " with error " + err);
    //         return res.status(401).send({ error: 'Unauthorized' });
    //     }
        req.user = decoded;
        next();
    // });
};