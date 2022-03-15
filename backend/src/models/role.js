const {Schema, model} = require('mongoose');
const {Types: {ObjectId}} = Schema;

const roleSchema = new Schema(
    {
        project: {
            type: ObjectId,
            ref:'project',
        },
        name: {
            type: String,
            required: true
        },
        skills:{
            type: [ObjectId],
            ref: 'skill',
            required: true
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
)

module.exports = model('role', roleSchema);
