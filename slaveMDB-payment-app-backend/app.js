
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

console.log("Mongo db url: ", process.env.MONGO_URL, process.env.NODE_ENV);

const app = express();
app.use(express.json());
app.use(cors());

const storeData = require("./Controllers/storeData");
const sendReceipt = require("./Controllers/sendReceipt");
const getData = require("./Controllers/getData");

mongoose.connect(`${process.env.MONGO_URL}`);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use("/vape/api/storeData", storeData);
app.use("/vape/api/sendReceipt", sendReceipt);
app.use("/vape/api/getData", getData);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
