const {Schema, model} = require('mongoose');
const {Types: {ObjectId}} = Schema;

const participantSchema = new Schema(
    {
        participant: {
            type: ObjectId,
            ref: 'user',
            required: true
        },
        project: {
            type: ObjectId,
            ref: 'project'
        },
        roles: {
            type: [ObjectId],
            ref:'role',
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
)

module.exports = model('participant', participantSchema);
