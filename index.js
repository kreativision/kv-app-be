const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const productsController = require("./controllers/products.controller");
const usersController = require("./controllers/user.controller");

// Env Variables Config.
const port = process.env.PORT;
const clusterUri = process.env.CLUSTER_URI;

// App Instance.
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productsController);
app.use("/users", usersController);

async function startApp() {
  console.log("Connecting Database Cluster...");
  try {
    mongoose.connect(clusterUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    mongoose.connection.on("connected", () => {
      console.log("Cluster Connected Successfully.");
      console.log("Starting App...");
      const server = app.listen(port, () =>
        console.log(`App Started Successfully on port ${port}`)
      );
    });
  } catch (error) {
    console.log("Cluster Connection Failed!");
    console.log(error);
  }
}

startApp();
