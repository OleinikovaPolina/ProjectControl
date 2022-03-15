const {Router} = require('express');
const ParticipantModel = require('../models/participant');
const router = Router();

router.get('/', (req, res) => {
    const {id: userId} = req.user;

    return ParticipantModel
        .find({participant: userId})
        .populate({
            path: 'project',
            select: '_id title short_description description leader',
            populate: {
                path: 'leader',
                select: '_id name email'
            }
        })
        .populate({path: 'roles', select: 'name project'})
        .then((data) => {
            const n = data.length
            for (let i = 0; i < n; i++) {
                if (!data[i]) {
                    data.pop(i)
                } else if (data[i].roles[0].project === undefined) {
                    data.pop(i)
                }
            }
            return res.send(
                data.map(({_id, roles, project}) => (
                    {
                        id: _id,
                        roles,
                        project: {
                            id: project.id,
                            title: project.title,
                            short_description: project.short_description,
                            description: project.description,
                            leader: {
                                id: project.leader.id, name: project.leader.name, email: project.leader.email
                            }
                        }
                    }
                ))
            )
        })
        .catch(() => {
            return res.sendStatus(400);
        });
})

router.get('/project', (req, res) => {
    const {id: _id} = req.query

    return ParticipantModel
        .find({project: _id})
        .populate({
            path: 'participant',
            select: 'name'
        })
        .populate({path: 'roles', select: 'name'})
        .then((data) => {
            return res.send(
                data.map(({_id, participant, roles}) => ({
                    id: _id,
                    participant: {
                        id: participant._id,
                        name: participant.name
                    },
                    roles
                }))
            )
        })
        .catch(() => {
            return res.sendStatus(400);
        });
})

router.delete('/', async (req, res) => {
    const {id: _id} = req.query;
    const {id: userId} = req.user;

    return ParticipantModel
        .findById({_id})
        .populate({
            path: 'project',
            match: {leader: userId}
        })
        .then((data) => {
            if (data) {
                return ParticipantModel
                    .findByIdAndDelete({_id})
                    .then(() => {
                        return res.sendStatus(200)
                    })
                    .catch(() => {
                        return res.sendStatus(400);
                    })
            }
            return res.sendStatus(400);
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})
router.delete('/me', async (req, res) => {
    const {id: _id} = req.query;
    const {id: userId} = req.user;

    return ParticipantModel
        .findOneAndDelete({_id, participant: userId})
        .then((data) => {
            if (!data) return res.sendStatus(400);
            return res.sendStatus(200)
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})
module.exports = router;
