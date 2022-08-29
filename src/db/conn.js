const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/studentform",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connection Successfull");
}).catch((e)=>{
    console.log("No Connection");
})
