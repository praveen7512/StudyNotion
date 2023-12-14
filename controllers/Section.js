const Course = require("../models/Course");
const Section = require("../models/Section");


exports.createSection = async (req, res) => {
    try {

        /* data fectching ka kama */
        const { sectionName, courseId } = req.body;


        /* data validation */
        if (!sectionName || !courseId) {
            return res.status(400).json({
                sucess: false,
                message: "all fields are required"
            })
        }

        /* create Section */
        const newSection = await Section.create({
            sectionName
        });


        /* update course with section ObjectId */

        const updateCourseDetails = await Course.findByIdAndUpdate(
            courseId, {
            $push: {
                courseContent: newSection._id
            }
        }, {
            new: true
        }
        );
        /* respnse return */
        return res.status(200).json({
            sucess: true,
            message: "Section created SucessFully",
            data: updateCourseDetails
        })


    }
    catch (error) {
        return res.status(500).json({
            sucess: false,
            message: "Something went wrong while creating the section"
        })

    }
}


exports.updateSection = async (req, res) => {
    try {

        const { sectionName, sectionId } = req.body;

        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "all fieds are required"
            })

        }

        const updateSection = await Section.findByIdAndUpdate(
            sectionId, {
            sectionName
        }, {
            new: true
        }
        );

        return res.status(200).json({
            success: true,
            message: "Section updated SucessFully",
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the section"
        })

    }
}

exports.deleteSection = async (req, res) => {
    try {

        const { sectionId } = req.params;
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                messagee: "Section Id is required"

            })

        }
        /* do we need to delete the entry from course schema */
        const deleteSection = await Section.findByIdAndDelete(sectionId);
        console.log(deleteSection);

        return res.status(200).json({
            success: true,
            message: "Section Deleted SuccessFully"
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the Section"
        })
    }
}


