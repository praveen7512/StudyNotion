const { config } = require("dotenv");
const Section = require("../models/Section");
const SubSeciton = require("../models/SubSection");
config();



exports.createSubSection = async (req, res) => {
    try {

        /* fectching the data */
        /* data validation */
        /* create the sub section */
        /* update the section */
        const { sectionId, title, timeDuration, description } = req.body;
        const videoUrl = req.files.file;

        if (!title || !timeDuration || !description || !videoUrl) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }

        /* uploading to cloudinary */
        const videoUploadToCloudinary = await imageUploadToCloudinary(videoUrl, process.env.FOLDER_NAME);


        const subSection = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl: videoUploadToCloudinary.secure_url
        })

        const updateSection = await Section.findByIdAndUpdate(sectionId, {
            $push: {
                subSection: subSection._id
            }
        }, { new: true });


        return res.status(200).json({
            success: true,
            message: "sub section created sucessfully",
            data: updateSection
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the sub Section"
        })
    }
}


/* TODO : update the subSection and delete the subSection */

