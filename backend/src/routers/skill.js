const {Router} = require('express');
const SkillModel = require('../models/skill');
const router = Router();

router.get('/', (req, res) => {
    return SkillModel
        .find({})
        .then((data) => {
            return res.send(data.map(({id, name}) => ({id, name})))
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

router.post('/', (req, res) => {
    const {name} = req.body;

    return SkillModel
        .create({name})
        .then(({_id,name}) => {
            return res.send({id: _id, name})
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})


router.delete('/', async (req, res) => {
    const {id: _id} = req.body;
    return SkillModel
        .findByIdAndDelete({_id})
        .then((data) => {
            if (!data) {
                return res.sendStatus(400)
            }
            return res.sendStatus(200)
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

module.exports = router;
