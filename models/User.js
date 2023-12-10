const { default: mongoose } = require("mongoose");

const userSchhema = new mongoose.Schema({
    firstName : {
        type : String, 
        required : true,
        trim : true
    },
    lastName : {
        type : String, 
        required : true,
        trim : true
    },
    email : {
        type : String, 
        required : true,
        trim : true
    },
    password : {
        type : String, 
        required : true
    },
    accountType : {
        type : String, 
        required : true,
        enum : ["Admin" , "Student", "Instructor"]
    },
    addtionalDetails : {
        type : mongoose.Schema.Types.ObjectId, 
        required : true,
        ref : "Profile"
    },
    courses: {
        type : mongoose.Schema.Types.ObjectId, 
        ref : "Course",
    },
    image : {
        type : String,
        require: true
    },
    courseProgess : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "CourseProgess"
    }

})

module.exports = mongoose.model("User", userSchhema);


//write a javascript code for
