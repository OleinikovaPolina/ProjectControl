const {Router, application} = require('express');

const RoleModel = require('../models/role');
const ParticipantModel = require('../models/participant');
const ApplicationModel = require('../models/application');

const router = Router();

router.get('/', (req, res) => {
    const {id: project} = req.query;

    return RoleModel
        .find({project})
        .populate({path: 'skills', select: 'id name'})
        .then((data) => {
            return res.send(
                data.map(({_id, name, skills}) => ({
                    id: _id,
                    name,
                    skills: skills.map(({_id, name}) => ({id: _id, name}))
                }))
            )
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

router.get('/forApps', (req, res) => {
    const {id: project, user} = req.query;
    const {id: participant} = req.user
    let idUser = user
    if (!user) {
        idUser = participant
    }
    return RoleModel
        .find({project})
        .populate({path: 'skills', select: 'id name'})
        .then((data) => {
            ApplicationModel.find({user: idUser, project}).then((data2) => {
                ParticipantModel.findOne({participant:idUser, project}).then((data3) => {
                    if (data3) {
                        for (const roleKey in data3.roles) {
                            data = data.filter(x => x._id.toString() !== data3.roles[roleKey].toString())
                        }
                    }
                    if (data2) {
                        for (const roleKey in data2) {
                            data = data.filter(x => x._id.toString() !== data2[roleKey].role.toString())
                        }
                    }
                    return res.send(
                        data.map(({_id, name, skills}) => ({
                            id: _id,
                            name,
                            skills: skills.map(({_id, name}) => ({id: _id, name}))
                        }))
                    )
                }).catch(() => {
                    return res.sendStatus(400)
                })
            }).catch(() => {
                return res.sendStatus(400)
            })
        }).catch(() => {
            return res.sendStatus(400)
        })
})
router.post('/', (req, res) => {
    const {project, skills, name} = req.body;

    return RoleModel
        .create({project, skills, name})
        .then((user) => {
            const {_id: id, project, skills, name} = user;
            return res.send({id, project, skills, name});
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

router.post('/update', (req, res) => {
    const {id: projectId} = req.body;
    let {roles} = req.body;
    const {id: userId} = req.user;

    return RoleModel
        .find({project: projectId, leader: userId})
        .select('id name skills')
        .then((data) => {
            data.forEach((role) => {
                let findrole = roles.find(r => r.id === role.id)
                if (findrole) {
                    RoleModel
                        .findByIdAndUpdate({_id: role.id}, {name: findrole.name, skills: findrole.skills})
                        .then(() => ({}))
                        .catch(() => ({}))
                    roles = roles.filter(x => x.id !== role.id)
                } else {
                    RoleModel
                        .findByIdAndDelete({_id: role.id})
                        .then(() => ({}))
                        .catch(() => ({}))
                }
            })
            roles.forEach((role) => {
                RoleModel
                    .create({project: projectId, skills: role.skills, name: role.name})
                    .then(() => ({}))
                    .catch(() => ({}))
            })
            return res.sendStatus(200)
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})


router.delete('/', (req, res) => {
    const {id: _id} = req.query;

    return RoleModel
        .findByIdAndDelete({_id})
        .then((data) => {
            if (data) {
                return ApplicationModel
                    .find({role:_id})
                    .then((data) => {
                        data.forEach((application)=>{
                            ApplicationModel
                                .findByIdAndDelete({_id:application._id})
                                .then(()=>({}))
                                .catch(()=>({}))
                        })
                        return res.sendStatus(200)
                    })
                    .catch(() => {
                        return res.sendStatus(400);
                    })
            }
            return res.sendStatus(400)
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})


module.exports = router;