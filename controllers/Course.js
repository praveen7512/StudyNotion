const Course = require("../models/Course");
const Tag = require("../models/Tag");
const User = require("../models/User");
const { imageUploadToCloudinary } = require("../utils/imageUpload");






exports.createCourse = async (req, res) => {
    try {

        const { courseName, courseDescription, whatYouWilllearn, ratingAndReviews, price, tag } = req.body;

        const thumbnail = req.files.body;


        /* validating the data */
        if (!courseName || !courseDescription || !whatYouWilllearn || !ratingAndReviews || !price || !tag || !thumbnail) {
            return res.status(400).json({
                sucess: false,
                message: "all fieds are required"
            })


        }        
        const userId = req.user._id;
        const instructorDetails = await User.findById(userId);
        console.log("instructorDetails", instructorDetails);

        if (!instructorDetails) {
            return res.status(400).json({
                sucess: false,
                message: "instructor not found"
            })
        }

        /* check for given the tag is valid or not */
        const tagDetails = await Tag.findById(tag);

        if (!tagDetails) {
            return res.status(400).json({
                sucess: false,
                message: "tag not found"
            })
        }

        /* uploading to cloudinary */

        const thumbnailImage = await imageUploadToCloudinary(thumbnail, process.env.FOLDER_NAME);


        /* create an entry for the new course */

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWilllearn,
            instructor: instructorDetails._id,
            price,
            thumbnail: thumbnailImage.secure_url,
            tag: tagDetails._id,
        });

        console.log("newCourse", newCourse);

        /* add the new course to the user schema */

        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id
                }
            }, { new: true }
        )

        /* update the tag schema */

        await Tag.findByIdAndUpdate(
            { _id: tagDetails._id },{
               
                $push : {
                    courses: newCourse._id
                }
            }
        )

        /* return response */

        return res.status(200).json({
            sucess: true,
            messsage: "course created Successfully",
            data : newCourse,
        })



    }
    catch (error) {
        /* logging the error in case of mistake */
        console.log("error ghas occured while creating the course", error);

        return res.status(500).json({
            sucess: false,
            message: "Something went wrong while creating the course",
            error : error.message
        })


    }
}

exports.showAllCourses = async (req, res) => {
    try {
       
        const allCourses = await Course.find(
            {},
            { courseName: true, courseDescription: true,
                 tag: true, thumbnail: true ,
                 price : true,
                 ratingAndReviews : true,
                 whatYouWilllearn : true,
                 studentsEnrolled : true
            } 
        ).populate("instructor").populate("tag").exec();

        console.log("allCourses", allCourses);

        return res.status(200).json({
            sucess: true,
            message: "All courses fetched successfully",
            data : allCourses
        })
    }
    catch (error) {
        console.log("error ghas occured while getting the course", error);
        return res.status(500).json({
            sucess : false,
            message : "Something went wrong while getting the course",
        })
    }
}

exports.getCourseDetails = async (req , res) => {
    try {
     
        //get id of the course
        const {courseId} = req.body;

        //
        const courseDetails = await Course.find(
                                     {_id : courseId}
                                     .populate(
                                         {
                                           path : "Instructor",
                                           populate : {
                                             path : "additonalDetails"
                                           }      
                                         }
                                     ).
                                     populate("category").
                                     populate("ratingAndReviews")
                                     .populate(
                                         {
                                             path : "courseContent",
                                             populate : {
                                                 path : "subSection"
                                             }
                                         }
                                     )
                                      ).exec();
        
        if(!courseDetails){
            return res.status(400).json({
                success : false ,
                message : `COuld not find the course with ${courseId}`
            })
        }

    }catch (error) {
       return res.stauts(500).json({
        success : false, 
        message : error.message
       })
    }
}