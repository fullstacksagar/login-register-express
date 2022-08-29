
require("dotenv").config()
const express = require("express")
const app = express()
const port = process.env.PORT || 4000
const path = require("path")
const hbs = require("hbs");
const cookieParser = require("cookie-parser")
const Contact = require("./models/contact");
const bcrypt = require("bcryptjs");
const auth = require("./middleware/auth")
const jwt = require("jsonwebtoken");

require("./db/conn");
const Students = require("./models/register");


const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../src/templates/views")
const partials_path = path.join(__dirname, "../src/templates/partials")
// console.log(partials_path);


//middleware to use request.body
app.use(express.json())
app.use(cookieParser())  //cookieParser middleware
//to get form data (remove undefined data)
app.use(express.urlencoded({ extended: false }))
app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path)

app.get("/", (req, res) => {
  res.render("index")
})

app.get("/register", (req, res) => {
  res.render("register")
})
app.get("/contact", (req, res) => {
  res.render("contact")
})

// insert contact enquiry
app.post("/contact", async (req, res) => {
  try {

    const getContact = new Contact({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message
    })
    const insertContact = await getContact.save()
    res.redirectr("/")

  } catch (e) {
    res.status(400).send(e)
  }
})
// register student 
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cPassword = req.body.cpassword;
    if (password === cPassword) {
      const registerStudents = new Students({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
      })
      const token = await registerStudents.generateAuthToken()
      // set cookie
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 90000), //set cookie for 9 min
        httpOnly: true
      })
      const insertStudent = await registerStudents.save()
      res.redirect("/")
    }
    else {
      res.send("Password not matching")
    }

  } catch (e) {
    res.status(400).send(e)
  }
})

// student login 
app.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const checkStudentEmail = await Students.findOne({ email: email });
    // compare bcrypt password 
    const passwordMatch = await bcrypt.compare(password, checkStudentEmail.password)
    const token = await checkStudentEmail.generateAuthToken()

    // set cookie
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 90000), //set cookie for 9 min
      httpOnly: true,
      // secure:true   apply only on htpps:connection
    })
    if (passwordMatch) {
      res.redirect("/profile")
    }
    else {
      res.status(400).send("password not match")
    }

  } catch (error) {
    res.status(400).send("invalid credentials")
  }
})


app.get("/profile", auth, (req, res) => {
  res.render("profile")
})
app.get("/logout", auth, async (req, res) => {
  try {
    req.studentData.tokens = req.studentData.tokens.filter((currElement) => {
      return currElement.token != req.token
    })

    res.clearCookie("jwt");
    await req.studentData.save()
    res.redirect("/")
  } catch (error) {
    res.send(500).send(error)
  }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})