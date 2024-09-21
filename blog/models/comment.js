const { Schema, model } = require("mongoose");
const {User}= require("./user")
const {Blog}= require("./blog")
const commentSchema=new Schema({
    content :{
        type:String,
        required:true
    },
    blogId:{
        type: Schema.Types.ObjectId,
        ref: "Blog",
    },
    createdBY: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

})

const Comment = model("comment", commentSchema);
module.exports = Comment;