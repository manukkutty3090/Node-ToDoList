const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');

const date = require(__dirname + "/date.js");
const today = date.getDate();

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/todolistDB");

//DEFINE SCHEMA AND MODEL FOR "/" ROUTE
const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);


//DEFINE SCHEMA AND MODEL FOR "/:CUSTOM" ROUTE
const customeListSchema = {
  name: String,
  items: [itemsSchema]
};
const CustomeList = mongoose.model("CustomeList", customeListSchema);

//DEFAULT ITEMS ON EACH ROUTE LIST
const item1 = new Item({
  name: "Welcome to your ToDoList"
});
const item2 = new Item({
  name: "Hit + to add new Item"
});
const item3 = new Item({
  name: "<-- hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

// GET METHOD FOR "/" ROUTE
app.get("/", (req, res) => {
  Item.find({}, function(err, result) {
    if (result.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("successfully inserted the default items");
        }
      })
      res.redirect("/");
    } else {
      res.render("list", {
        heading: today,
        newListItems: result
      })
    }
  })
});


// GET METHOD FOR ".:CUSTOME" ROUTE
app.get("/:customeListName", (req, res) => {
  const customeListName = _.capitalize(req.params.customeListName);

  CustomeList.findOne({
    name: customeListName
  }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        //create a new list
        const list = new CustomeList({
          name: customeListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customeListName);
      } else {
        res.render("list", {
          heading: foundList.name,
          newListItems: foundList.items
        })
      }
    }
  })
});

// POST METHOD FOR "/" ROUTE
app.post("/", (req, res) => {
  const item = req.body.newItem;
  const listName = req.body.listName;

  const items = new Item({
    name: item
  });

  //VALIDATE THE LISTNAME AND REDIERECT THE ROUTE
  if (listName === today) {
    items.save();
    res.redirect("/")
  } else {
    CustomeList.findOne({
      name: listName
    }, (err, foundList) => {
      foundList.items.push(items);
      foundList.save();
      res.redirect("/" + listName)
    });
  };

});

// POST METHOD FOR "/DELETE" ROUTE
app.post("/delete", (req, res) => {
  const deleteItemId = req.body.itemId;
  const listName = req.body.listName;

  //VALIDATE THE LISTNAME AND REDIERECT THE ROUTE
  if (listName === today) {
    Item.findByIdAndRemove(deleteItemId, (err) => {
      console.log(err);
    })
    res.redirect("/");
  } else {
    CustomeList.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: deleteItemId
        }
      }
    }, (err, foundList) => {
      if (!err) {
        res.redirect("/" + listName);
      }
    })
  }
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
})
