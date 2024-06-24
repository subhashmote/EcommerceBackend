const express = require("express");
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, liketheBlog, disliketheBlog } = require("../controllers/blogCtrl");
const router = express.Router();

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");


router.post("/createblog",authMiddleware,isAdmin,createBlog);
router.put("/likes",authMiddleware,liketheBlog);
router.put("/dislike",authMiddleware,disliketheBlog);
router.put("/:id",authMiddleware,isAdmin,updateBlog);
router.get("/:id",getBlog);
router.get("/",getAllBlogs);
router.delete("/:id",authMiddleware,isAdmin,deleteBlog);


module.exports = router;