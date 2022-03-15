const {Schema, model} = require('mongoose');
const {Types: {ObjectId}} = Schema;

const userSchema = new Schema(
    {
        login: {
            type: String,
            required: true,
            unique: true,
        },
        pass: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        bio: {
            type: String,
            required: true
        },
        skills:{
            type: [ObjectId],
            ref: 'skill',
            required: true
        },
        email: {
            type: String,
        }
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
)

module.exports = model('user', userSchema);
