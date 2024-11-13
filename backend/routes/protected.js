const router = require('express').Router();
const passport = require('passport');
const role = require('../middleware/role');

router.get('/admin', passport.authenticate('jwt', { session: false }), role(['admin']), (req, res) => {
    res.send('Admin content');
});

router.get('/user', passport.authenticate('jwt', { session: false }), role(['user', 'admin']), (req, res) => {
    res.send('User content');
});

module.exports = router;