const {Router} = require('express');
const ApplicationModel = require('../models/application');
const router = Router();
const ParticipantModel = require('../models/participant');

router.get('/user', (req, res) => {
    const {id: user} = req.user;

    return ApplicationModel
        .find({user, hiddenUser: false})
        .populate({
            path: 'project', select: '_id title short_description',
            populate: {path: 'leader', select: '_id name email'}
        })
        .populate({path: 'role', select: '_id name skills', populate: {path: 'skills', select: 'name'}})
        .then((data) => {
            data.forEach((app,i) => {
                if (!app){
                    data.pop(i)
                }
            })
            return res.send(
                data.map(({_id, typeProject, typeUser, typeStart, project, role}) => ({
                    id: _id,
                    typeProject,
                    typeUser,
                    typeStart,
                    project,
                    role
                }))
            )
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

router.get('/project', (req, res) => {
    const {id: _id} = req.query;

    return ApplicationModel
        .find({project: _id, hiddenProject: false})
        .populate({
            path: 'user',
            select: '_id name email skills',
            populate: {path: 'skills'}
        })
        .populate({path: 'role', select: 'name'})
        .then((data) => {
            return res.send(
                data.map(({_id, typeProject, typeUser, typeStart, user, role}) => ({
                    id: _id,
                    typeProject,
                    typeUser,
                    typeStart,
                    user,
                    role
                }))
            )
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

router.post('/user', (req, res) => {
    const {project, role} = req.body;
    const {id: user} = req.user;

    return ApplicationModel
        .create({
            user,
            project,
            typeProject: 0,
            typeUser: 1,
            typeStart: 0,
            role,
            hiddenUser: false,
            hiddenProject: false
        })
        .then(() => {
            return res.sendStatus(200)
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

router.post('/project', (req, res) => {
    const {project, user, role} = req.body;

    return ApplicationModel
        .create({
            user,
            project,
            typeProject: 1,
            typeUser: 0,
            typeStart: 1,
            role,
            hiddenUser: false,
            hiddenProject: false
        })
        .then(({_id, typeProject, typeUser, typeStart, user, role}) => {
            return res.send({
                id: _id,
                typeProject,
                typeUser,
                typeStart,
                user,
                role
            })
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})
router.post('/hidden', (req, res) => {
    const {id: _id, hidden} = req.body;

    return ApplicationModel
        .findByIdAndUpdate({_id}, hidden)
        .then(({hiddenUser, hiddenProject}) => {
            if ((hidden.hiddenUser && hiddenProject) || (hidden.hiddenProject && hiddenUser)) {
                return ApplicationModel
                    .findByIdAndDelete({_id})
                    .then((data) => {
                        if (!data) return res.sendStatus(400);
                        return res.sendStatus(200)
                    })
                    .catch(() => {
                        return res.sendStatus(400);
                    })
            }
            return res.sendStatus(200)
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})
router.post('/update', (req, res) => {
    const {id: _id, type} = req.body;

    return ApplicationModel
        .findById({_id})
        .then(({_id, typeStart, user, role, project}) => {
            if (type === 1) {
                ParticipantModel
                    .findOne({participant: user, project})
                    .then((data) => {
                        if (data) {
                            const {_id} = data
                            let {roles} = data
                            roles.push(role)
                            ParticipantModel
                                .findByIdAndUpdate({_id}, {roles})
                                .then(() => ({}))
                                .catch(() => ({}))
                        } else {
                            const roles = [role]
                            ParticipantModel
                                .create({participant: user, project, roles})
                                .then(() => ({}))
                                .catch(() => ({}))
                        }
                    })
                    .catch(() => ({}))
            }
            let forUpdate = {}
            if (typeStart === 0) {
                forUpdate.typeProject = type
                forUpdate.typeUser = 1
            }
            if (typeStart === 1) {
                forUpdate.typeUser = type
                forUpdate.typeProject = 1
            }
            return ApplicationModel
                .findByIdAndUpdate({_id}, forUpdate)
                .then((data) => {
                    if (!data) return res.sendStatus(400);
                    return res.send({typeStart, project})
                })
                .catch(() => {
                    return res.sendStatus(400);
                })
        })
})

router.delete('/', async (req, res) => {
    const {id: _id} = req.query;

    return ApplicationModel
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
