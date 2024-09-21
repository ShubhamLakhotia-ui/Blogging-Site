const express = require("express");
const routes = require("./routes/user");
const blogRoutes=require("./routes/blog");
const app = express();
const path = require("path");
const Blog=require("./models/blog")
const mongoose = require("mongoose");
const cookieParser=require("cookie-parser");
const { checkForAuth } = require("./middlwares/authentications");
const PORT = 8000;
app.use(express.urlencoded({extended:false}));
mongoose
  .connect("mongodb://127.0.0.1:27017/blogify")
  .then((e) => console.log("MongoDB Connected"));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
// app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(checkForAuth("token"))
app.use("/user", routes);
app.use("/blog",blogRoutes);
app.use(express.static(path.resolve("./public")));

app.get("/", async(req, res) => {
    const allBlogs=await Blog.find({});
  res.render("home",{
    user:req.user,
    blogs:allBlogs
  });
});

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
