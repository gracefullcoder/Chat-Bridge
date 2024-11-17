const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Chat = require("../models/chat");



router.get("/:emailId", async (req, res) => {
    const { emailId } = req.params;
    const users = await User.findOne({ emailId }).populate({ path: "friends.friend", select: "name emailId" });
    res.json(users?.friends);
})


router.post("/signup", async (req, res) => {
    const { name, email } = req.body;
    const user = await User.findOne({ emailId: email });
    // console.log(user, 'dfvsg', req.body);
    if (user) {
        res.json({ status: "success", message: "Login successfull", userDetails: { userId: user._id, mainLang: user.mainLang || "en", paymentId: user.paymentId || false } });
    } else {
        const newUser = new User({ name, emailId: email });
        await newUser.save();
        res.json({ status: "success", message: "User Created Successfully!", userDetails: { userId: newUser._id, mainLang: user.mainLang || "en", paymentId: user.paymentId || false } });
    }
}
)

router.post("/request", async (req, res) => {
    try {
        const { emailId, userId } = req.body;

        const offerUser = await User.findOne({ emailId });

        if (!offerUser) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        const isRequested = offerUser.requests.some(request =>
            request.toString() === userId
        );

        if (isRequested) {
            return res.json({
                status: "info",
                message: "Already requested or friends"
            });
        }

        const chat = new Chat();
        await chat.save();

        await Promise.all([

            User.findByIdAndUpdate(
                offerUser._id,
                {
                    $push: {
                        requests: userId,
                        friends: {
                            friend: userId,
                            chatId: chat._id
                        }
                    }
                }
            ),

            User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        requests: offerUser._id,
                        friends: {
                            friend: offerUser._id,
                            chatId: chat._id
                        }
                    }
                }
            )
        ]);

        res.json({
            status: "success",
            message: "Friend added successfully!",
            user: { chatId: chat._id, friend: { emailId: emailId, name: offerUser.name, _id: offerUser._id } }
        });
    } catch (error) {
        console.error('Friend request error:', error);
        res.status(500).json({
            status: "error",
            message: "Failed to process friend request"
        });
    }
});

module.exports = router;

