const {Schema, model} = require('mongoose');
const {Types: {ObjectId}} = Schema;

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        short_description: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        participants: {
            type: [ObjectId],
            ref: 'participant',
            required: true
        },
        deadline: {
            type: Date
        },
        times: {
            type: [Date]
        },
        project: {
            type: ObjectId,
            ref: 'project',
            required: true
        },
        type_task: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
)

module.exports = model('task', taskSchema);
