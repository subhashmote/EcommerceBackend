const express = require("express");
const router = express.Router();
const { createCategory, updateCategory, deleteCategory, getCategory, getallCategory } = require("../controllers/blogcatCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/",authMiddleware,isAdmin,createCategory);
router.put("/:id",authMiddleware,isAdmin,updateCategory);
router.delete("/:id",authMiddleware,isAdmin,deleteCategory);
router.get("/:id",authMiddleware,isAdmin,getCategory);
router.get("/",getallCategory);




module.exports = router;
