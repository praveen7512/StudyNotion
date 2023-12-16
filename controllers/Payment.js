const { default: mongoose } = require("mongoose");
const { instance } = require("../config/razorpay");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");

exports.capturePayment = async (req , res) =>{
    try {
        const {course_id} = req.body;
        const userId = req.body;
        
        if(!course_id){
            return res.json({
                success : false,
                message : "please provide valid course ID"
            })
        }
        let course;
        try {

         course = await Course.findById(course_id);
         if(!course_id){
            return res.json({
                success : false,
                message : "please provide valid course ID"
            })
         }

         //check if user is already paid for the course 
         /* yaha pe mein issliye convert kr raha hu kyuki course mein user id string mein hai */
         const uid = new mongoose.Types.ObjectId(userId);
         if(course.studentEnrolled.includes(uid)){
            return res.status(200).json({
                success : false ,
                message : "student is already enrolled"
            })
         }


         const amount = course.price;
         const currency = "INR";

         const options = {
            amount : amount *100,
            currency,
            receipt : Math.random(Date.now()).toString(),
            notes : {
                courseId : course_id,
                userId,
            }
        }

        try {
           
            //intiate the payment using razorpay
            const paymentResponse = await instance.orders.create(options);
            console.table([paymentResponse]);

            return res.status(200).json({
                success : true, 
                courseName : course.courseName,
                courseDescription : course.courseDescription,
                thumbnail : course.thumbnail,
                orderId : paymentResponse.id,
                currency : paymentResponse.currency,
                amount : paymentResponse.amount,
            })

        }
         catch (error) {
            return res.json({
                success : false,
                message : "please provide valid course ID"
            })
        }


        } catch (error) {
            
        }




    }catch (error) {
      return res.status(500).json({
         success : false,
         message : "Please Provide Valid Course ID"
      })   
    }
}

exports.verifySignature =  async (req , res) =>{
    
      const webhookSecret = "123456789";

      const signature = req.headers("x-razorpay-signature");


      const shasum = crypto.createHmac("sha256",webhookSecret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest("hex");

      if(signature === digest){
        console.log("Payment is Authorised");

        const {courseId , userId} = req.body.payload.payment.entity.notes;

        try {
         
            
        //fulfill the action
                                                     
        //find the course and enroll the user in it
        
        const enrolledCourse = await Course.findOneAndUpdate(
            { _id : courseId} , { $push : { studentEnrolled : userId}}, {new : true}
        );

        if(!enrolledCourse){
            return res.status(500).json({
                success: false, 
                message : "Course not found"

            })
        }


        console.log(enrolledCourse);

        const enrolledStudent = await User.findOneAndUpdate(
            {_id : userId}, {$push  : {courses: courseId}}, {new : true}
        )

        console.log(enrolledStudent);


        //ab confirmation waala mail send karenge

        const emailResponse = await mailSender(
            enrolledStudent.email,
            "Congo , got enrolled",
            "Congo you are onBoarded"

        )

        console.log(emailResponse);
        return res.status(200).json({
            sucess : false , 
            message : "Signature verify SuccesFully"
        })


        }catch (error) {
            return res.status(500).json({
                sucess : false , 
                message : "Signature not verify SuccesFully"
            })
        }


      }
      else {
        return res.status(400).json({
            success : false, 
            message : "Signature Does not verify"
        })
      }



}




