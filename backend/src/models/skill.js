const {Schema, model} = require('mongoose');

const skillSchema = new Schema(
    {
        name: {
            type: String,
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

module.exports = model('skill', skillSchema);
