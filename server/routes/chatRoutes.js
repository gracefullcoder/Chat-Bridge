const express =require("express");
const router = express.Router();
const User = require("../models/user");
const Message = require("../models/message");
const Chat = require("../models/chat");


router.post("/",async(req,res) => {
    const {message,fromEmailId,chatId,fromId,toId,lang} = req.body;

    let newMessage = new Message({message,emailId:fromEmailId,lang:lang});
    newMessage = await newMessage.save();
    console.log(newMessage);

    if(chatId == null){
        const newChat = new Chat({messages:[newMessage._id]});
        await newChat.save();

        await User.findByIdAndUpdate(fromId,{$push:{friends:{chatId:newChat._id,friend:toId}}});
        await User.findByIdAndUpdate(toId,{$push:{friends:{chatId:newChat._id,friend:fromId}}});
    }else{
        const messageId = newMessage._id;
        await Chat.findByIdAndUpdate(chatId,{$push:{messages:messageId}});
    }
    
    res.json({status:"success",message:"sent"});
})

router.get("/:id",async (req,res) => {
    const {id} = req.params;

    const chats = await Chat.findById(id).populate("messages");

    res.json(chats);
})

module.exports = router;

