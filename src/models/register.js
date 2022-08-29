
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator");
const jsonwebtoken = require("jsonwebtoken");
const { Schema } = mongoose;

const studentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        minlength: 10,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    date: { type: Date, default: Date.now },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

//generating token on register

studentSchema.methods.generateAuthToken = async function () {
    try {
        const token = jsonwebtoken.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part" + error)
    }
}



//used in bcryptjs to hash password
studentSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})


const Student = mongoose.model('student', studentSchema);
// Student.createIndexes()
module.exports = Student;
