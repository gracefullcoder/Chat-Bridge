const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    paymentId: {
        type: String
    },
    mainLang: {
        type: String,
        default: "en"
    },
    friends: [{
        friend: {
            type: Schema.Types.ObjectId, 
            ref: "User"
        },
        chatId: {
            type: Schema.Types.ObjectId,
            ref: "Chat"
        },
        _id: false
    }],
    requests: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
});

userSchema.index({ emailId: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;