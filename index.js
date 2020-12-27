//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const { trimStart, isBuffer } = require("lodash");
const mongoose =require("mongoose");
const port = process.env.PORT || 5000;

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

//to connect to mongoose
// mongoose.connect("mongodb://localhost:27017/todolistDB", {useUnifiedTopology: true, useNewUrlParser : true});
 

mongoose.connect("mongodb+srv://kylieyoo55:yooy2242@cluster0.s7syc.mongodb.net/blogDB?retryWrites=true&w=majority" ,
{useUnifiedTopology: true},
{useNewUrlParser: true}
);

//Schema for post construction
const postSchema = {
  title:String,
  content:String
}


//post model
const Post =mongoose.model("Post", postSchema);

//new post
const newPost = new Post({
  title:"Home",
  content:"Welcome to Kylie's Blog, If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.For writers, a random sentence can help them get their creative juices flowing. Since the topic of the sentence is completely unknown, it forces the writer to be creative when the sentence appears. There are a number of different ways a writer can use the random sentence for creativity. The most common way to use the sentence is to begin a story. Another option is to include it somewhere in the story. A much more difficult challenge is to use it to end a story. In any of these cases, it forces the writer to think creatively since they have no idea what sentence will appear from the tool."

})


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{

Post.find({},(err,foundPost)=>{

  if(foundPost.length === 0){
    newPost.save();
    res.redirect("/")
  }else{
    res.render("home",{content:foundPost});
  }
  
})
 
})

app.get("/about",(req,res)=>{
    res.render("about",{content:aboutContent});
  })

  app.get("/contact",(req,res)=>{
    res.render("contact",{content:contactContent});
  })

app.get("/compose",(req,res)=>{
    res.render("compose");
})

app.get("/post/:topic", (req,res)=>{
  const requestedId=req.params.topic;

Post.findById(requestedId,(err,foundPost)=>{
  if(!err){
    res.render("post",{post:foundPost})
  }else{
    console.log(err);
  }
  
}) 

})

//Write the new post
app.post("/compose",(req,res)=>{
const newTitle=req.body.postTitle;
const newContent=req.body.postContent

const postData= new Post({
    title:newTitle,
    content:newContent
});
postData.save();

res.redirect("/");
 
})

//delete the post
app.post("/delete",(req,res)=>{
  const requestId=req.body.id;


  Post.deleteOne({_id:requestId},(err)=>{
    if(!err){
      console.log("Deleted Successfully");
      res.redirect("/");
    }
  })

})

//connect to heroku port
app.listen(port, () => console.log(`Listening on ${ port }`));
