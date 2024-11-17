const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const messageSchema = new Schema({
    message:{
        type:"String"
    },
    emailId:{
        type:"String"
    },
    lang:{
        type:"string"
    }
},{timestamps:true})

const Message = mongoose.model("Message",messageSchema);

module.exports = Message;