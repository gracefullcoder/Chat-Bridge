const mongoose  = require("mongoose");

async function connectDb(){
    const mongoUrl = process.env.MONGO_URI;

    mongoose.connect(mongoUrl)
    .then(() => {console.log("Connected To Db")})
    .catch((err) => {console.log("Can't connect to db " , err)})
}

module.exports = connectDb;