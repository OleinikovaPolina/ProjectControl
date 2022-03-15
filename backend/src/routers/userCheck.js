const {Router} = require('express');

const UserModel = require('../models/user');

const router = Router();

router.post('/', (req, res) => {
    const {id: idToken} = req.user;
    const {id} = req.body;
    if (id !== idToken) {
        return res.sendStatus(400);
    }

    return UserModel
        .findById(id)
        .populate({path: 'skills', select: '_id name'})
        .then(({login, name, email, bio, skills}) => {
            return res.send({
                login, name, email, bio, skills: skills.map(({_id, name}) => ({id: _id, name}))
            });
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})
router.post('/update', (req, res) => {
    const {id: _id} = req.user;
    const {email, name, bio, skills} = req.body;

    return UserModel
        .findByIdAndUpdate({_id}, {email, name, bio, skills})
        .then((data) => {
            if (!data) {
                return res.sendStatus(400)
            }
            return res.send({id: data._id})
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})
router.get('/all', (req, res) => {
    const {id: idUser} = req.user
    return UserModel
        .find({_id: {$ne: idUser}})
        .populate({path: 'skills', select: 'name'})
        .then((data) => {
            return res.send(
                data.map(({_id, name, email, skills}) => ({id: _id, name, email, skills}))
            )
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})
router.get('/allPages', (req, res) => {
    const {id: idUser} = req.user
    let {page} = req.query
    if (!page) {
        page = 0
    } else {
        page -= 1
    }
    return UserModel
        .find({_id: {$ne: idUser}})
        .limit(10)
        .skip(10 * page)
        .populate({path: 'skills', select: 'name'})
        .then((data) => {
            return UserModel
                .find({_id: {$ne: idUser}})
                .count()
                .then((count) => {
                    return res.send({
                        pages: Math.ceil(count / 10),
                        data: data.map(({_id, name, email, skills}) => ({id: _id, name, email, skills}))
                    })
                })
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})
router.get('/one', (req, res) => {
    const {id: _id} = req.query

    return UserModel
        .findById({_id})
        .populate({path: 'skills', select: '_id name'})
        .then(({name, email, bio, skills}) => {
            return res.send({
                name,
                bio,
                email,
                skills: skills.map(({_id, name}) => ({id: _id, name}))
            })
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})
module.exports = router;