const { Router } = require("express");
const router = Router();
const path = require("path");
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const authentication = require("../middlwares/authentications");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
router.get("/add-new", (req, res) => {
  return res.render("addBlogs", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBY");
  const comments= await Comment.find({blogId:req.params.id}).populate("createdBY");
  console.log("Comments",comments);
  return res.render("blog", {
    user: req.user,
    blog,
    comments
  });
});

router.post("/comments/:blogId", async (req, res) => {
    console.log("Crated=====>",req.user._id);
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBY: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBY: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
