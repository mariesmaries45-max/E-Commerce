const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    brand: {
      type: String,
      default: 'Generic',
    },
    category: {
      type: String,
      default: 'Mobile',
    },
    countInStock: {
      type: Number,
      default: 10,
      min: 0,
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
