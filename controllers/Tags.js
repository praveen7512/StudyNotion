const Tag = require("../models/Tag");


exports.createTag = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                sucess: false,
                message: "all fieds are required"
            })
        }

        const tagDetails = await Tag.create({
            name: name,
            descreuption: description
        })
        console.log(tagDetails);

        return res.status(200).json({
            sucess: true,
            message: "Tag created SucessFully"
        })
    }
    catch (error) {
           console.log("error ghas occured while creating the tag", error);
           res.status(500).json({
            sucess : false,
            message : "something went wrong while creating the tag"
           })
    }
}


exports.showAllTags = async (req ,res ) => {
    try {
     
        const allTags = await Tag.find({}, {name : true, description : true});
        res.status(200).json({
            sucess  : true,
            message : "Tag created SucessFully"
        })
    }catch (error) {
        console.log("error ghas occured while getting the tag", error);
           res.status(500).json({
            sucess : false,
            message : "something went wrong while getting the tag"
           })
    }
}