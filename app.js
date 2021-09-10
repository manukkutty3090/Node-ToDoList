const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const items = ["Buy Food", "Eat Food", "Cook Food"]
const workItems = [];
const date = require(__dirname + "/date.js" )
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

const today = date.getDate();

app.get("/", (req, res) => {
  res.render("list", {
    heading: today,
    newListItems: items
  })
});

// work list //

app.get("/work",(req,res)=>{
  res.render("list",{
    heading:"Work List",
    newListItems:workItems
  })
});

app.post("/", (req, res) => {

  if (req.body.list === "Work"){
    const workItem = req.body.newItem;
    workItems.push(workItem);
    res.redirect("/work")
  }else{
    const item = req.body.newItem;
    items.push(item);
    res.redirect("/")
  }
});


app.listen(3000, () => {
  console.log("server is running on port 3000");
})
