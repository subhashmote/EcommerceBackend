const Razorpay = require("razorpay");

const instance = new Razorpay({
    key_id:'rzp_test_Vbu2AMBbOLvSOB',
    key_secret:'P4h2POz9yyw2ewAkfaBf47YA',
})



exports.checkout = async(req,res)=>{
    const {amount} = req.body;
    const option = {
        amount: amount * 100,
        currency:"INR",
    }

    const order = await instance.orders.create(option);

    res.json({
        order,
        success:true,
    });
}

exports.paymentVerification = async(req,res)=>{
    const {razorpayOrderId,razorpayPaymentId} = req.body;

    res.json({
        razorpayOrderId,
        razorpayPaymentId
    })
}