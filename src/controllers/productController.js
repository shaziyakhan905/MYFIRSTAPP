const Product = require("../models/productModel")

const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    // console.log(req.file)
    //   if (req.file) {
    //     productData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    //     console.log(productData.imageUrl)
    //   }

    const product = await Product.create(productData);
    return res.status(201).json({ status: 'success', product });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

// get All Product

const getAllProduct = async (req, res) => {
  try {
    const allProduct = await Product.find()
    return res.status(200).json({ status: "success", allProduct })

  } catch (error) {
    return res.status(404).json({ status: "error", message: error.message })
  }
}

//get Single product 
const getProductById = async (req, res) => {
  try {
    const userId = req.params.id;
    const singleProduct = await Product.findById(userId)
    if (!singleProduct) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    return res.status(200).json({ status: "success", singleProduct })

  } catch (error) {
    return res.status(404).json({ status: "error", message: error.message })
  }
}

const getUpdateById = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true } // Return the updated doc and run validations
    );

    if (!updatedProduct) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    return res.status(200).json({ status: "success", product: updatedProduct });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

// delete api 

const getDeleteProductById  = async(req,res)=>{
  try{
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    return res.status(200).json({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
  }


module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  getUpdateById,
  getDeleteProductById
}