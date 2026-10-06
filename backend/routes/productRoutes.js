const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Get all active products with search
router.get("/", async (req, res) => {
  try {
    const { search, category, lang = "en" } = req.query;
    const query = { status: "active" };

    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate("translations")
      .sort({ createdAt: -1 });

    // Return localized data for each product
    const localizedProducts = products.map(product => 
      product.getLocalizedData(lang)
    );

    return res.status(200).json({
      success: true,
      products: localizedProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch products",
    });
  }
});

// Get single product by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { includeAll, lang = "en" } = req.query;

    const query = { slug };
    if (!includeAll) {
      query.status = "active";
    }

    const product = await Product.findOne(query).populate("translations");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product: product.getLocalizedData(lang),
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch product",
    });
  }
});

// Create new product
router.post("/", async (req, res) => {
  try {
    const productData = req.body;

    const product = await Product.create(productData);

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create product",
    });
  }
});

// Update product by slug
router.put("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const productData = req.body;

    const product = await Product.findOneAndUpdate(
      { slug },
      productData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update product",
    });
  }
});

// Delete product by slug
router.delete("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOneAndDelete({ slug });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete product",
    });
  }
});

module.exports = router;
