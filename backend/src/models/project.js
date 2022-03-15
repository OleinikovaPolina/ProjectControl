const {Schema, model} = require('mongoose');
const {Types: {ObjectId}} = Schema;

const projectSchema = new Schema(
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
            type: String,
            required: true
        },
        leader: {
            type: ObjectId,
            ref: 'user',
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

module.exports = model('project', projectSchema);
