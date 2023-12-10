const { config } = require("dotenv");
const { default: mongoose } = require("mongoose");
config();

exports.connectWithDb = ()=>{

        //Connection to Database
        mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
             console.log("DB Connected SucessFully")
        })
        .catch((error) => {
            console.log("DB connection is failed")
            console.error(error)
            process.exit(1)
        })
}
