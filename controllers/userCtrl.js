


const userModel = require("../models/userModel");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongodbId = require("../utils/validateMongodbId");
const {generateRefreshToken} = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {mailSend} = require("../controllers/emailCtrl");
const uniqid = require("uniqid");
const { log } = require("console");


// Register A User
exports.createUser = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const findUser = await User.findOne({ email });
        if (!findUser) {
            // User not found then craete user 
            const newUser = await User.create(req.body);
            res.json(newUser);
        }
        else {
            // user already found 
            throw new Error("User Already Exist");
        }
    }
    catch (error) {
        throw new Error("Error in Registering the User");
    }
});


// Login A User
exports.loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
   
    // check if user exists or not 
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);

        const updateuser = await User.findByIdAndUpdate(findUser.id,{
            refreshToken:refreshToken,
        },{
            new:true,
        });

        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge:60*60*24*7,
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    }
    else {
        throw new Error("Invalid User Name");
    }
});


// Admin Login
exports.loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("Not Authorised");
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findAdmin?._id);
      const updateuser = await User.findByIdAndUpdate(
        findAdmin.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: findAdmin?._id,
        firstname: findAdmin?.firstname,
        lastname: findAdmin?.lastname,
        email: findAdmin?.email,
        mobile: findAdmin?.mobile,
        token: generateToken(findAdmin?._id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  });

// Handle refresh token
exports.handleRefreshToken = asyncHandler(async(req,res) => {
    const cookie = req.cookies;
    console.log(cookie);
    if(!cookie?.refreshToken)throw new Error("No refresh token in cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user)throw new Error("no Refresh token found in db.");

    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
        if(err || user.id !== decoded.id){
            throw new Error("There is something wrong with refresh token");
        }
       const accessToken = generateToken(user?._id);
        // console.log(decoded);
        res.json({accessToken});
    })
})

// Get User WishList
exports.getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    // console.log(req.user);
    try {
      const findUser = await User.findById(_id).populate("wishlist");
    //   console.log(findUser);
      res.json(findUser);
    } catch (error) {
      throw new Error(error);
    }
  });

  // save user Address
exports.saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    // validateMongoDbId(_id);
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          address: req?.body?.address,
        },
        {
          new: true,
        }
      );
      res.json(updatedUser);
    } catch (error) {
      throw new Error(error);
    }
  });

// logout Functionality
exports.logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); 
    }
    await User.findOneAndUpdate({
      refreshToken: "",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204);
  });
  


// Update a User
exports.updateUser = asyncHandler(async (req, res) => {
    const { id } = req.user;

    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
            {
                new: true,
            });
        res.json(updateUser);
    }
    catch (error) {
        throw new Error(error);
    }
})

// Get All Users
exports.getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    }
    catch (error) {
        throw new Error(error);
    }
});


// Get A Single User
exports.getuser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const getUser = await User.findById(id);
        res.json({
            getUser,
        })
    }
    catch (error) {
        throw new Error(error);
    }
})


// Delete A User
exports.deleteuser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const deleteuser = await User.findByIdAndDelete(id);
        res.json({
            deleteuser,
        });
    }
    catch (error) {
        throw new Error(error);
    }
})


// block the user

exports.blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const blockuser = await User.findByIdAndUpdate(id, {
            isBlocked: true,
        }, {
            new: true,
        });
        res.json({
            message: "User Blocked",
        });
    }
    catch (error) {
        throw new Error(error);
    }
})

// unblock the user
exports.unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const unblockuser = await User.findByIdAndUpdate(id, {
            isBlocked: false,
        }, {
            new: true,
        });
        res.json({
            message: "User UnBlocked",
        });
    }
    catch (error) {
        throw new Error(error);
    }
})


// update the password
exports.updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongodbId(_id);
    const user = await User.findById(_id);
    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      res.json(updatedPassword);
    } else {
      res.json(user);
    }
  });


  exports.forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
      const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        html: resetURL,
      };
      mailSend(data);
      res.json(token);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  exports.resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  });

 
  exports.userCart = asyncHandler(async (req, res) => {
    const { productId,quantity,price} = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        

        let newCart = await new Cart({
            userId:_id,
            productId,
            quantity,
            price
        }).save();

        res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
});



  exports.getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
      const cart = await Cart.find({ userId: _id }).populate(
        "productId"
      );
      res.json(cart);
    } catch (error) {
      throw new Error(error);
    }
  });
  

exports.emptyCart = asyncHandler(async(req,res)=>{
  const { _id } = req.user;
    validateMongodbId(_id);
    try {
      const deleteAllProductFromCart = await Cart.deleteMany({userId:_id}); 
      res.json(deleteAllProductFromCart);
  } catch (error) {
      throw new Error(error);
  }
})


exports.removeProductFromCart = asyncHandler(async(req,res)=>{
  const { _id } = req.user;
    validateMongodbId(_id);
    const {cartItemId} = req.params;
    try {
      const deleteProductFromCart = await Cart.deleteOne({userId:_id,_id:cartItemId}); 
      res.json(deleteProductFromCart);
  } catch (error) {
      throw new Error(error);
  }
})


exports.updateProductQuantityFromCart = asyncHandler(async(req,res)=>{
  const { _id } = req.user;
    validateMongodbId(_id);
    const {cartItemId,newQuantity} = req.params;
    try {
      const cartItem = await Cart.findOne({userId:_id,_id:cartItemId}); 
      cartItem.quantity = newQuantity;
      cartItem.save();
      res.json(cartItem);
  } catch (error) {
      throw new Error(error);
  }
})


exports.createOrder = asyncHandler(async(req,res)=>{
  const {shippingInfo,orderItems,totalPrice,totalPriceAfterDiscount,paymentInfo} = req.body;
  const {_id} = req.user;

  try{
    const order = await Order.create({
      shippingInfo,
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
      paymentInfo,
      user:_id
    });
    res.json({
      order,
      success:true,
    })
  }
  catch(error){
    throw new Error(error); 
  }
})

exports.getMyOrders = asyncHandler(async(req,res)=>{
  const {_id} = req.user;
  try{
    const orders = await Order.find({user:_id}).populate("user").populate("orderItems.product");
    res.json({
      orders,
    })
  }
  catch(error){
    throw new Error(error); 
  }
})


exports.getAllOrders = asyncHandler(async(req,res)=>{

  try{
    const orders = await Order.find().populate("user");
    res.json({
      orders,
    })
  }
  catch(error){
    throw new Error(error); 
  }
})


exports.getSingleOrder = asyncHandler(async(req,res)=>{
  const {id} = req.params;
  try{
    const order = await Order.findOne({_id:id}).populate("orderItems.product");
    res.json({
      order,
    })
  }
  catch(error){
    throw new Error(error); 
  }
})

exports.updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // Find the order by its id
    const order = await Order.findById(id);

    // Check if the order exists
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Update the order status
    order.orderStatus = req.body.status;
    await order.save();

    // Respond with the updated order
    res.json({
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





exports.getMonthWiseOrderIncome = asyncHandler(async(req,res)=>{
  let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let d = new Date();
  let endDate ="";

  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth()-1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }

  const data = await Order.aggregate([
    {
      $match:{
        createdAt:{
          $lte:new Date(),
          $gte:new Date(endDate)
        }
      }
    },
    {
      $group:{
        _id:{
          month:{ $month: "$createdAt" }
        },
        amount:{
          $sum:"$totalPriceAfterDiscount"
        },
        count:{
          $sum:1
        }
      }
    }
  ])

  res.json(data);

})




exports.getYearlyOrders = asyncHandler(async(req,res)=>{
  let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let d = new Date();
  let endDate ="";

  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth()-1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }

  const data = await Order.aggregate([
    {
      $match:{
        createdAt:{
          $lte:new Date(),
          $gte:new Date(endDate)
        }
      }
    },
    {
      $group:{
        _id:null,
        count:{
          $sum: 1
        },
        amount:{
          $sum:"$totalPriceAfterDiscount"
        }
      }
    }
  ])

  res.json(data);

})

  