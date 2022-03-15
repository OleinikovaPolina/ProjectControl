const {Router} = require('express');
const TaskModel = require('../models/task');
const ProjectModel = require('../models/project');
const router = Router();

router.get('/', (req, res) => {
    const {id: project} = req.query;

    return TaskModel
        .find({project})
        .populate({
            path: 'participants',
            select: '_id roles participant',
            populate: [{path: 'roles', select: 'name'}, {path: 'participant', select: 'name'}]
        })
        .populate({path: 'project', select: 'leader'})
        .then((data) => {
            return res.send(data.map(({
                                          _id,
                                          title,
                                          short_description,
                                          description,
                                          participants,
                                          deadline,
                                          times,
                                          type_task,
                                          project,
                                          createdAt
                                      }) => ({
                id: _id,
                title,
                short_description,
                description,
                participants: participants.map(
                    ({_id, roles, participant}) => ({
                        id: _id,
                        roles,
                        participant: {id: participant.id, name: participant.name}
                    })
                ),
                deadline,
                times,
                type_task,
                project: {leader: project.leader.toString()},
                createdAt
            })))
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

router.post('/', (req, res) => {
    const {title, short_description, description, participants, deadline,  project} = req.body;
    const {id: userId} = req.user;

    return ProjectModel
        .findById({_id: project})
        .populate({
            path: 'leader',
            match: userId
        })
        .then((data) => {
            if (data.leader) return TaskModel
                .create({
                    title,
                    short_description,
                    description,
                    participants,
                    deadline,
                    times: [],
                    project,
                    type_task:0
                })
                .then(() => {
                    return res.sendStatus(200)
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
    const {id: _id, title, short_description, description, participants, deadline,  type_task} = req.body;
    const {id: userId} = req.user;
    return TaskModel
        .findById({_id})
        .populate({path: 'project', populate: {path: 'leader', match: {_id: userId}, select: 'name'}})
        .populate({path: 'participants', populate:{path: 'participant', match: {_id: userId}}})
        .then((data) => {
            if (data.project.leader || data.participants.length > 0) {
                let times2 = data.times
                if (data.type_task !== type_task) {
                    times2.push(new Date())
                }
                return TaskModel
                    .findByIdAndUpdate({_id}, {
                        title,
                        short_description,
                        description,
                        participants,
                        deadline,
                        times: times2,
                        type_task
                    })
                    .then((data) => {
                        if (!data) return res.sendStatus(400);
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

router.delete('/', async (req, res) => {
    const {id: _id} = req.query;
    const {id: userId} = req.user;
    return TaskModel
        .findById({_id})
        .populate({path: 'participants', match: {_id: userId}})
        .populate({
            path: 'project',
            populate: {path: 'leader', match: {_id: userId}}
        })
        .then((data) => {
            if (data.project.leader || data.participants)
                return TaskModel
                    .findByIdAndDelete({_id})
                    .then((data) => {
                        if (!data) {
                            return res.sendStatus(400)
                        }
                        return res.send({id:data._id})
                    })
                    .catch(() => {
                        return res.sendStatus(400);
                    })
        })
        .catch(() => {
            return res.sendStatus(400);
        })
})

module.exports = router;
