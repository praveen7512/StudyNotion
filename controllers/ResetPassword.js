const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");


exports.resetPasswordToken = async (req, res) => {

    try {

        /* get the email */
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "email is required"
            })
        }

        /* check for the user */
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json(
                {
                    sucess: false,
                    message: "Your email is not registered with us"
                }
            )
        }

        /* create a token */
        const token = crypto.randomUUID();

        const updateDetails = User.findOneAndUpdate(
            { email: email }
            , {
                token: token,
                resetPasswordTokenExpires: Date.now() + 30 * 60 * 1000
            },
            { new: true }
        )
        /* send a mail to the user */
        const url = `http://localhost:3000/reset-password/${token}`;

        await mailSender(email, "Reset Password", `Password Reset Link is here -> ${url}`);

        return res.status(200).json({
            sucess: true,
            message: "email sent SuccessFully, please check your email"

        })

    }
    catch (error) {
        console.log("error has occure while reseting the password", error);
        return res.status(400).json({
            success: false,
            message: "Something went wrong while resetiting the password"
        })
    }

}

exports.resetPassword = async (req, res) => {

    /* 
    1. data validation,
    2. get userdetails using token,
    3. if no entry of token , invalid token,
    4. if token expired, invalid token,
    5. hash the new password,
    6. update the password in db,
    7. return response 
    */

    try {
        const { password, resetPassword, token } = req.body;

        if (password !== resetPassword) {
            return res.status(400).json({
                sucess: false,
                message: "Password does not match"
            })
        }

        const userdetails = await User.findOne(
            { token: token }
        );

        if (!userDetails) {
            return res.status(400).json({
                sucess: false,
                message: "Invalid Token"
            })
        }

        if (userDetails.resetPasswordTokenExpires < Date.now()) {
            return res.status(400).json({
                sucess: false,
                message: "Token Expired"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true }
        )

        return res.status(400).json({
            sucess: true,
            message: "Password Reset Succesfully"
        })
    }

    catch (error) {

        console.log("an error has occured while resting the passsword", error);
        return res.status(400).json({
            sucess: false,
            message: "Something went wrong while resetiing the password"
        })
    }

}