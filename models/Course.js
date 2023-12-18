// const { default: mongoose } = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName : {
        type : String,
        trim : true,
        required : true
    },
    courseDescription : {
        type : String,
        trim : true
    },
    instructor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"    
    },
    whatYouWilllearn : {
        type : String,
        trim : true
    },
    courseContent :[ {
        type :mongoose.Schema.Types.ObjectId,
        ref : "Section"
    }],
    ratingAndReviews : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "RatingAndReview"
    }],
    price : {
        type : Number
    },
    tag : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Tag"
    },
    thumbnail : {
        type : String
    }, 
    studentsEnrolled : [{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    }]
})


module.exports = mongoose.model("Course", courseSchema)
