const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");

//createRating
exports.createRating = async (req, res)=>{
    try {
    
      //GET USER ID
      const userId  = req.user.id;

      const {rating , review , courseId} = req.body;

      const courseDetails = await Course.findOne(
              {_id : courseId , studentEnrolled : {$eleMatch : {$eq : userId}},
            }
      )

      if(!courseDetails) {
        return res.status(404).json({
            success : false,
            message : "course not found"
        })
      }

      const alreadyReviewed = await RatingAndReview.findOne({
        user : userId , 
        course : courseId,
      })

      if(alreadyReviewed){
        return res.status(403).json({
            success : false,
            message : "user is reviewd this course"
        })
      }

      const ratingReview = await RatingAndReview.create({
        rating , review , course : courseId , user : userId
      })

     const updatedCourseDetails = await Course.findByIdAndUpdate(courseId , {
        $push : {
            RatingAndReview : ratingReview._id
        }
      }, {new : true})
      
      console.log(updatedCourseDetails);
      
      //return the response
      return res.status(200).json({
        success : true, 
        message : "Rating and Review created SuccessFully",
        ratingReview
      })

    }
    catch (error) {
        return res.status(500).json({
            success : false, 
            message : "Rating and Review  unSuccessFully",
            ratingReview
          })
    }
}


//average rating handler
exports.getAverageRating = async (req , res ) =>{
    try {
    
        //get the courseId
        const courseId = req.body.courseId;

        const result = 




        //calculate the average rating
        // return the response





    }
    catch (error) {
        
    }
}


exports.getAllRating = async (req , res) => {
  try {
        const allReviews = await RatingAndReview.find({})
                           .sort({rating : "desc"})
                           .populate({path : "user", select : "firstName lastName email image"})
                           .populate({ path : "course" , select : "courseName"})
                           .exec();


        return res.status(200).json({
          success  : true,
          message : 'Student is not enrolled in this course'
        })                   

  }
  catch (error) {
     return res.status(500).json(
      {
        success : false, 
        message : "Ratings not found"
      }
     )
  }
}
