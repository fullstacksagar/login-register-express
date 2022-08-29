const jwt = require("jsonwebtoken");
const Student = require("../models/register")

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyStudent = jwt.verify(token, "helloiamsagarkumarprajapati");
        const studentData = await Student.findOne({ _id: verifyStudent._id })
        req.token=token;
        req.studentData=studentData;
        console.log(studentData);
        next();
    } catch (error) {
        res.status(401).send(error)
        
    }
}

module.exports = auth