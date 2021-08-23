const express = require("express");

const cors = require("cors");

const axios = require("axios");

require("dotenv").config();

const server = express();

server.use(cors());

server.use(express.json());

const mongoose = require("mongoose");

PORT = process.env.PORT;

mongoose.connect(
  "mongodb://ghadeer:z1qeLgSlQJ2g53yQ@ghadeer1-shard-00-00.2owf0.mongodb.net:27017,ghadeer1-shard-00-01.2owf0.mongodb.net:27017,ghadeer1-shard-00-02.2owf0.mongodb.net:27017/Test-Database?ssl=true&replicaSet=atlas-50igf7-shard-0&authSource=admin&retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const dataSchema = new mongoose.Schema({
  strDrink: String,
  strDrinkThumb: String,
});

const dataModel = new mongoose.model("data", dataSchema);

const ownerSchema = new mongoose.Schema({
  ownerEmail: String,
  ownerArr: [dataSchema],
});

const ownerModel = new mongoose.model("owner", ownerSchema);

function seedingData() {
  const Ghadeer = new dataModel({
    strDrink: "Hi",
    strDrinkThumb: "Second thing",
  });

  const Roaa = new dataModel({
    strDrink: "Hi",
    strDrinkThumb: "Second thing",
  });

  Ghadeer.save();
  Roaa.save();
}

// seedingData();
function seedingOwner() {
  const Ghadeer = new ownerModel({
    ownerEmail: "ghadeerkhasawneh91@gmail.com",
    ownerArr: [
      {
        strDrink: "Hi",
        strDrinkThumb: "Second thing",
      },
    ],
  });

  const Roaa = new ownerModel({
    ownerEmail: "hi",
    ownerArr: [
      {
        strDrink: "Hi",
        strDrinkThumb: "Second thing",
      },
    ],
  });
  Ghadeer.save();
  Roaa.save();
}

// seedingOwner();

server.get("/getData", getDataHandler);

function getDataHandler(req, res) {
  axios
    .get(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`
    )
    .then((results) => {
      res.send(results.data.drinks);
    })
    .catch((err) => {
      console.log(err);
    });
}

server.post("/addingData", addingDataHandler);

function addingDataHandler(req, res) {
  const { ownerEmail, strDrink, strDrinkThumb } = req.body;
  ownerModel.find({ ownerEmail: ownerEmail }, (err, result) => {
    results[0].ownerArr.push({
      strDrink: "Hi New",
      strDrinkThumb: "Second Hello",
    });

    results[0].save();
    res.send(results[0].ownerArr);
  });
}

server.get("/getDataBase", getDataBaseHanler);

function getDataBaseHanler(req, res) {
  const { ownerEmail } = req.query;

  ownerModel.find({ ownerEmail: ownerEmail }, (err, results) => {
    console.log(results[0].ownerArr);

    res.send(results[0].ownerArr);
  });
}

server.delete("/deleteData/:idx", deleteDataHandler);

function deleteDataHandler(req, res) {
  const { ownerEmail } = req.query;
  const { idx } = req.params;

  ownerMode.find({ ownerEmail: ownerEmail }, (err, results) => {
    const newArr = results[0].ownerArr.filter((item, index) => {
      if (index != idx) {
        return true;
      }
    });

    results[0].ownerArr = newArr;
    results[0].save();

    res.send(results[0].ownerArr);
  });
}

server.put("/updateData/:index", updateDataHandler);
function updateDataHandler(req, res) {
  const { ownerEmail, strDrink, strDrinkThumb } = req.body;
  const { idx } = req.params;

  ownerModel.findOne({ ownerEmail: ownerEmail }, (err, results) => {
    results[0].ownerArr.splice(index, 1, {
      strDrink: "Hi New",
      strDrinkThumb: "Second Hello",
    });

    results.save();
    res.send(results.ownerArr);
  });
}

server.listen(PORT, () => {
  console.log("Listenning");
});
