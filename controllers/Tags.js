const Tag = require("../models/Tag");


exports.createCategory = async (req, res) => {
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


exports.showAllCategory = async (req ,res ) => {
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

exports.CategoryPageDetails = async (req , res) => {
    try {
        const {categoryId} = req.body;

        const selectedCategory = await Category.findById(categoryId).populate("courses").exec();

        if(!selectedCategory){
            return res.status(404).json({
                success : false, 
                message : "Data Not Found"
            })
        }

        const differentCategory = await Category.find({_id : {$ne : categoryId}}).populate("courses").exec();


        res.status(200).json({
            sucess  : true,
            message : "Tag created SucessFully",
            data : {
                selectedCategory,
                differentCategory
            }
        })
    }catch (error) {
        console.log("error ghas occured while getting the category", error);
           res.status(500).json({
            sucess : false,
            message : "something went wrong while getting the category"
           })
    }
}