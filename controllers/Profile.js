const Profile = require("../models/Profile");
const User = require("../models/User");


exports.updateProfile = async (req, res)=>{
    
     try {
        
        /* data fetch karo */
        /* validate karo data */
        /* user_id chahiyeh hogi for updating   */

        const {dateOfBirth="" , about ="" , contactNumbeer , gender } = req.body;

        const id = req.user.id;

        if(!id || !about || !contactNumbeer || !gender){
                  return res.status(400).json({
                    success : false ,
                    message : "All fieds are required"
                  })
        }

        const userDetails = await User.findById(id);

        const profileId = await userDetails.addtionalDetails;

        const profileDetails = await Profile.findById(profileId);

        profileDetails.dateofBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumbeer;

        await profileDetails.save();


        return res.status(200).json({
            success : true,
            messsage : "profile has been updated",
            profileDetails
        })

     }
     catch (error) {
        return res.status(500).json({
            success : false,
            message : "Some error has occured while updating the profile"
        })
     }


}

/* Account delete ki functionality add karo */
/* Cron job ke bare mein search krna */
exports.deleteAccount = async (req, res) => {
    try {
     
        /* get id */

        const id = req.user.id;

        /* validation on id */

        if(!id){
            return res.status(400).json({
                success : false, 
                message : "User not found"
            })
        }

        await Profile.findByIdAndDelete({_id : userDetails.addtionalDetails});

        await User.findByIdAndDelete({_id : id});

        return res.status(200).json({
            success : true,
            message : "User Delete SuccessFully"
        })

    }
    catch (error) {
        return res.status(500).json({
            success : false,
            message : "An error has occured while deleting the account"
        })
    }
}

exports.getAllUserDetails = async (req, res) =>{
    try {
     
        const {id} = req.user.id;

        if(!id){
            return res.status(400).json({ 
                success : false,
                message : "Users Details Does not exits"
            })
        }

        const usersDetails = await User.findById({id}).populate("additionalDetails").exec();

        return res.status(200).json({
            success : true, 
            message : "User details Fetch Successfully",
            data : usersDetails
        })
    }
    catch (error) {
        return res.status(500).json({
            success : false,
            messsage : "An Error has occured while getting the details"
        })
    }
}




