const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const mailSender = require("../utils/mailSender");
config();





//send OTP
exports.sendOTP = async (req, res) => {
    try {
        // Fetch the email from the request body
        const { email } = req.body;

        // Check if the user is already present
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already Present"
            });
        }

        // Generate an OTP
        let otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        console.log("OTP Generated", otp);

        // Check if the generated OTP already exists
        let result = await OTP.findOne({ otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
            result = await OTP.findOne({ otp });
        }
        const otpPayload = { email, otp };

        // Create an OTP document
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        // Send the response with the OTP
        res.status(200).json({
            success: true,
            message: "OTP sent Successfully",
            otp
        });
    } catch (error) {
        console.log("An error has occurred while sending the OTP", error);
    }
}


exports.signUp = async (req, res) => {
    try {

        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        if (!firstName || !lastName || !email || !password || !otp || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }


        if (password !== confirmPassword) {

            return res.status(400).json({
                success: false,
                message: "Password and confirm password does not match"
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                sucess: false,
                message: "User Already Registred"
            });
        }

        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        console.log("Recent OTP", recentOtp);

        if (recentOtp.length == 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        } else if (recentOtp.otp !== otp) {
            return res.status(400).json({
                sucess: false,
                message: "Invalid OTP"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            addtionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        });


        return res.status(200).json({
            success: true,
            message: "User Registred Successfully",
            user,
        });


    } catch (error) {
        console.log("error occured while singUp", error);
        return res.status(200).json({
            success: false,
            message: "An error occured while singUp",
        })
    }
}


exports.signIn = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                sucess: false,
                message: "All fields are required"
            })
        }


        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            });
            user.token = token;
            user.password = undefined;

            const optiions = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged In SuccesFully"
            })
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            stauts: false,
            message: "An error has occured while signing in"

        })
    }
}

exports.changePassword = async (req, res) => {
    try {

        const { email, oldPassword, newPassword } = req.body;


        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        else if (await bcrypt.compare(existingUser.password, oldPassword)) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const user = await User.findOneAndUpdate({ email }, { password: hashedPassword });

            await mailSender(email, "Password Changed Successfully", "Password Changed Successfully");

            return res.status(200).json({
                success: true,
                message: "Password Changed Successfully"
            })

        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        //If your exists and password is correct

        

    } catch (error) {
        console.log("error has occured while changing password", error);
        return res.status(200).json({
            success: false,
            message : "An error has occured While changing password"
        })
    }
}



