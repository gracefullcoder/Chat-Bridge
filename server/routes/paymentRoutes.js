const express = require("express");
const router = express.Router();
const {instance,validateSignature} = require("../config/razorpay");
const User = require("../models/user");


router.post("/", async (req, res) => {
    const { totalAmount } = req.body;

    console.log(totalAmount);

    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `reciept_${Math.floor(Math.random() * 10000000)}`,
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.status(200).json(order);
})

router.post("/success", async (req, res) => {
    const {userId, orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    console.log(req.body);
    if (!validateSignature(razorpayPaymentId, orderCreationId, razorpaySignature)) {
        return res.status(400).json({ msg: "Transaction not legit!" });
    }

    
    await User.findByIdAndUpdate(userId, {$set:{paymentId:razorpayPaymentId}});

    res.status(200).json({
        success: true, message: "Order Placed Successfully!",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId
    });
});


module.exports = router;