const router = require("express").Router();
const Product = require("../models/product.model");

// Get All Products
router.route("/").get(async (req, res) => {
  try {
    const products = await Product.find();
    return res.json({
      description: "Product List",
      response: { products, count: products.length },
    });
  } catch (error) {
    return res.status(500).json({
      description: "Something went wrong while fetching products list.",
      error,
    });
  }
});

// Create a new Service.
router.route("/add").post(async (req, res) => {
  try {
    const existing = await Product.findOne({
      productName: req.body.productName,
    });
    if (existing)
      return res.status(409).json({
        description: "A product with the same name already exists.",
        response: existing,
      });
    const { productName, productCategory, price, productImg } = req.body;
    const newProduct = new Product({
      productName,
      productCategory,
      price,
    });
    try {
      const createdProduct = await newProduct.save();
      res.json({
        description: `Product Item: ${productName} created under ${productCategory}.`,
        response: { createdProduct },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ description: "Failed to save new product.", error });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ description: "Something went wrong!", error });
  }
});

// Edit a service.
router.route("/edit").patch(async (req, res) => {
  try {
    const { id, productName, productCategory, price, productImg } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        productCategory,
        price,
        productImg,
      },
      { new: true, useFindAndModify: false }
    );
    if (updatedProduct)
      res.json({
        description: "Product Updated Successfully.",
        response: updatedProduct,
      });
    else
      res.status(404).json({
        description: "Product Cannot be updated as it doesn't exist",
      });
  } catch (error) {
    return res
      .status(500)
      .json({ description: "Failed to update product info.", error });
  }
});

// get service categories
router.route("/categories").get(async (req, res) => {
  try {
    const categories = await Product.distinct("productCategory");
    return res.json({ categories });
  } catch (error) {
    return res.status(500).json({
      description: "Something went wrong while retrieving product categories.",
      error,
    });
  }
});

module.exports = router;
