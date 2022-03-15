const {Router} = require('express');
const ProjectModel = require('../models/project');
const ParticipantModel = require("../models/participant");
const ApplicationModel = require("../models/application");
const TaskModel = require("../models/task");
const RoleModel = require("../models/role");
const router = Router();

router.get('/own', (req, res) => {
    const {id: leader} = req.user;

    return ProjectModel
        .find({leader})
        .sort({"_id": -1})
        .then((data) => {
            return res.send(
                data.map(({_id, title, short_description, description}) => ({
                    id: _id,
                    title,
                    short_description,
                    description
                }))
            )
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})
router.get('/notOwn', (req, res) => {
    const {id: leader} = req.user;

    return ProjectModel
        .find({leader: {$ne: leader}})
        .sort({"_id": -1})
        .then((data) => {
            return res.send(
                data.map(({_id, title, short_description, description}) => ({
                    id: _id,
                    title,
                    short_description,
                    description
                }))
            )
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

router.get('/notOwnPages', (req, res) => {
    const {id: leader} = req.user;
    let {page} = req.query
    if (!page) {
        page = 0
    } else {
        page -= 1
    }
    return ProjectModel
        .find({leader: {$ne: leader}})
        .sort({"_id": -1})
        .limit(10)
        .skip(10 * page)
        .then((data) => {
            return ProjectModel
                .find({leader: {$ne: leader}})
                .count()
                .then((count) => {
                    return res.send({
                        pages: Math.ceil(count / 10),
                        data: data.map(({_id, title, short_description, description}) => ({
                            id: _id,
                            title,
                            short_description,
                            description
                        }))
                    })
                })
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

router.get('/one', (req, res) => {
    const {id: _id} = req.query;

    return ProjectModel
        .findById({_id})
        .populate({path: 'leader', select: '_id name email'})
        .then(({_id, title, short_description, description, leader}) => {
            return res.send({
                    id: _id,
                    title,
                    short_description,
                    description,
                    leader: {
                        id: leader.id, name: leader.name, email: leader.email
                    }
                }
            )
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})
router.post('/', (req, res) => {
    const {title, short_description, description} = req.body;
    const {id: userId} = req.user;

    return RoleModel
        .create({skills:[], name:'Leader'})
        .then((role) => {
            const {_id:RoleId}=role
            return ProjectModel
                .create({title, short_description, description, leader: userId})
                .then(({title, short_description, description, _id}) => {
                    ParticipantModel
                        .create({participant: userId, project: _id, roles: [RoleId]})
                        .then((data) => {
                            if (!data) return res.sendStatus(400);
                            return res.sendStatus(200)
                        })
                        .catch(() => {
                            return res.sendStatus(400);
                        })
                    return res.send({title, short_description, description, id: _id})
                })
                .catch(() => {
                    return res.sendStatus(400);
                })
        })
        .catch(() => {
            return res.sendStatus(400);
        })

})

router.post('/update', (req, res) => {
    const {id: _id, title, short_description, description} = req.body;
    const {id: userId} = req.user;

    return ProjectModel
        .findOneAndUpdate({_id, leader: userId}, {title, short_description, description})
        .then(() => {
            return res.send({
                id: _id,
                title,
                short_description,
                description
            })
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

router.delete('/', async (req, res) => {
    const {id: _id} = req.query;
    const {id: userId} = req.user;
    return ProjectModel
        .findOneAndDelete({_id, leader: userId})
        .then((data) => {
            if (!data) {
                return res.sendStatus(400)
            }
            ApplicationModel
                .find({project: _id})
                .then((data) => {
                    data.forEach((application) => {
                        ApplicationModel
                            .findByIdAndDelete({_id: application._id})
                            .then(() => ({}))
                            .catch(() => ({}))
                    })
                })
                .catch(() => ({}))

            ParticipantModel
                .find({project: _id})
                .then((data) => {
                    data.forEach((participant) => {
                        ParticipantModel
                            .findByIdAndDelete({_id: participant._id})
                            .then(() => ({}))
                            .catch(() => ({}))
                    })
                })
                .catch(() => ({}))

            TaskModel
                .find({project: _id})
                .then((data) => {
                    data.forEach((task) => {
                        TaskModel
                            .findByIdAndDelete({_id: task._id})
                            .then(() => ({}))
                            .catch(() => ({}))
                    })
                })
                .catch(() => ({}))

            RoleModel
                .find({project: _id})
                .then((data) => {
                    data.forEach((role) => {
                        RoleModel
                            .findByIdAndDelete({_id: role._id})
                            .then(() => ({}))
                            .catch(() => ({}))
                    })
                })
                .catch(() => ({}))
            return res.sendStatus(200)
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

router.get('/statusUser', async (req, res) => {
    const {id: project} = req.query;
    const {id: userId} = req.user;

    return ProjectModel
        .findOne({_id: project, leader: userId})
        .then((leader) => {
            if (leader) {
                return res.send({leader: true, participant: true})
            } else {
                return ParticipantModel
                    .findOne({project, participant: userId})
                    .then((participant) => {
                        if (participant) {
                            return res.send({leader: false, participant: true})
                        } else {
                            return res.send({leader: false, participant: false})
                        }
                    })
                    .catch(() => {
                        return res.send({leader: false, participant: false})
                    })
            }
        }).catch(() => {
            return res.send({leader: false, participant: false})
        })
})
module.exports = router;
