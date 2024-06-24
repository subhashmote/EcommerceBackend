const express = require("express");
const router = express.Router();

const {
    createUser,
    loginUserCtrl,
    getallUser,
    getuser,
    deleteuser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    createOrder,
    removeProductFromCart,
    updateProductQuantityFromCart,
    getMyOrders,
    getMonthWiseOrderIncome,
    getYearlyOrders,
    getAllOrders,
    getSingleOrder,
    updateOrder
} = require("../controllers/userCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { checkout, paymentVerification } = require("../controllers/paymentCtrl");

// User Routes
router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.post("/order/checkout",authMiddleware,checkout);
router.post("/order/paymentVerification",authMiddleware,paymentVerification);
router.post("/cart", authMiddleware, userCart);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveAddress);
router.get("/cart", authMiddleware, getUserCart);
router.get("/getmonthwiseorderincome", authMiddleware, getMonthWiseOrderIncome);
router.get("/getyearlyorders", authMiddleware, getYearlyOrders);
router.get("/getallorders", authMiddleware,isAdmin,getAllOrders);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/delete-product-cart/:cartItemId", authMiddleware, removeProductFromCart);
router.delete("/update-product-cart/:cartItemId/:newQuantity", authMiddleware,updateProductQuantityFromCart);


router.post("/cart/create-order",authMiddleware,createOrder);
router.get("/getmyorders",authMiddleware,getMyOrders);







// Admin Routes
router.post("/admin-login", loginAdmin);
router.get("/getaorder/:id",authMiddleware,isAdmin,getSingleOrder);
router.put("/updateorder/:id",authMiddleware,isAdmin,updateOrder);
router.get("/all-users" ,getallUser);
router.get("/:id", authMiddleware, isAdmin, getuser);
// router.delete("/:id", authMiddleware, isAdmin, deleteuser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
