const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const productsController = require("./controllers/products.controller");

// Env Variables Config.
const port = process.env.PORT || 5000;
const clusterUri = process.env.CLUSTER_URI;

// App Instance.
const app = express();

// App Config
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/products", productsController);

async function startApp() {
  console.log("Trying DB Connection");
  try {
    const connection = await mongoose.connect(clusterUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    if (connection) {
      console.log("DB Cluster Connected.");
      console.log("Running Express App.");
      const server = app.listen(port, () =>
        console.log(`App Started Successfully on port ${port}`)
      );
    }
  } catch (error) {
    console.log("Cluster Connection Failed:");
    console.log(error);
  }
}

startApp();
