const { default: mongoose } = require("mongoose");

const courseProgess = new mongoose.Schema({
     
    courseID : {
        type : mongoose.Schema.Types.ObjectId,
        ref :  "Course"
    },
    completedVideos :[ {
        type : mongoose.Schema.Types.ObjectId,
        ref : "SubSection"
    }]
    
    

})

module.exports = mongoose.model("CourseProgess", courseSchema);



// add some 

 