const mongoose = require("mongoose")
const validator = require("validator")
const { Schema } = mongoose;

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        minlength: 10,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: { type: Date, default: Date.now },
});



const contact = mongoose.model('contact', contactSchema);
contact.createIndexes()
module.exports = contact;
