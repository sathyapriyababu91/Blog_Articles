const router = require("express").Router();
const blogController = require("../controller/blog.controller");

router.post("/", blogController.createBlog);

router.get("/", blogController.getAllBlogs);

router.get("/user/:username", blogController.getBlogsByUser);

router.get("/:id", blogController.getSingleBlog);

router.delete("/:id", blogController.deleteBlog);

module.exports = router;