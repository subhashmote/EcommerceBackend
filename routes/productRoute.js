const express = require("express");
const router = express.Router();

const {createProduct,getProduct,getAllProducts,updateProduct,deleteProduct,addToWishlist, rating} = require("../controllers/productCtrl");

const {authMiddleware,isAdmin} = require("../middlewares/authMiddleware");


router.post("/",authMiddleware,isAdmin,createProduct);
router.get("/",getAllProducts);
router.put("/wishlist",authMiddleware,addToWishlist);
router.put("/rating",authMiddleware,rating);
router.get("/:id",authMiddleware,isAdmin,getProduct);
router.put("/:id",authMiddleware,isAdmin,updateProduct);
router.delete("/:id",authMiddleware,isAdmin,deleteProduct);

module.exports = router;
