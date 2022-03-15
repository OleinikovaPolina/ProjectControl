const {Schema, model} = require('mongoose');
const {Types: {ObjectId}} = Schema;

const applicationSchema = new Schema(
    {
        user: {
            type: ObjectId,
            ref: 'user',
            required: true
        },
        project: {
            type: ObjectId,
            ref: 'project',
            required: true
        },
        typeProject: {
            type: Number,
            required: true
        },
        typeUser: {
            type: Number,
            required: true
        },
        typeStart: {
            type: Number,
            required: true
        },
        role: {
            type: ObjectId,
            ref:'role',
            required: true,
        },
        hiddenProject:{
            type: Boolean,
            required: true
        },
        hiddenUser:{
            type: Boolean,
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

module.exports = model('application', applicationSchema);
