const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const paypal = require("paypal-rest-sdk");
const connetDB = require("./config/db");
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to DB
connetDB();

//Router files
const payment = require("./routes/payment");

app.use("/api/v1/payment", payment);

app.listen(3000, () => {
  console.log("listening to port 3000");
});
