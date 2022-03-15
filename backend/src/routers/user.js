const {Router} = require('express');

const UserModel = require('../models/user');

const router = Router();

const {generateToken} = require('../utils');

router.post('/register', (req, res) => {
    const {login, pass, name, email, skills, bio} = req.body;

    return UserModel
        .create({login, pass, name, email, skills, bio})
        .then((user) => {
            const {_id: id, login, name} = user;
            const token = generateToken({id, login, name});
            res.cookie('auth', token, {httpOnly: true});
            return UserModel
                .findById(id)
                .populate({path: 'skills', select: '_id name'})
                .then(({_id,login, name, email, bio, skills}) => {
                    return res.send({
                       id:_id, login, name, email, bio, skills: skills.map(({_id, name}) => ({id: _id, name}))
                    });
                })
                .catch(() => {
                    return res.sendStatus(400);
                })
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

router.post('/login', (req, res) => {
    const {login: loginFromReq, pass: passFromReq} = req.body;
    if (!loginFromReq || !passFromReq) return res.sendStatus(400);

    return UserModel
        .findOne({login: loginFromReq})
        .populate({path: 'skills', select: '_id name'})
        .then((user) => {
            if (!user) return res.sendStatus(400);
            const {_id: id, login, pass, name, email, bio, skills} = user;
            if (pass !== passFromReq) return res.sendStatus(400);
            const token = generateToken({id, login, name});
            res.cookie('auth', token, {httpOnly: true});
            return res.send({id, login, name, email, bio, skills: skills.map(({_id, name}) => ({id: _id, name}))});
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

router.post('/logout', async (req, res) => {
    res.clearCookie('auth');
    return res.sendStatus(200);
})

module.exports = router;