const jwt = require("jsonwebtoken");
const user = require("../models/User");

//auth waala code 
exports.auth = async (req, res, next) => {
    try {

        const token = req.cookies.token
            || req.body.token
            || req.headers("Authorization").replace("Bearer ", "");

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is Missing"
            })
        }

        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token"
            })
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

exports.isStudent = async (req, res, next) => {

    try {
        const { email, accountType } = req.user;
        if (accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "You are not a Student"
            })
        }
        next();
    }
    catch (error) {

        console.log("error has occured while sending email", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })

    }

}

exports.isInstructor = async (req, res, next) => {

    try {
        const { email, accountType } = req.user;
        if (accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "You are not a Instructor"
            })
        }
        next();
    }
    catch (error) {

        console.log("error has occured while sending email", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })

    }

}

exports.isAdmin = async (req, res, next) => {
    try {

        const { acccountType } = req.user;

        if (acccountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "You are not an Admin"
            })
        }
        next();

    }
    catch (error) {
        console.log("error has occure while admin route", route);
        return res.status(500).json({
            sucess: false,
            message: "something went wrong"
        })
    }
}
