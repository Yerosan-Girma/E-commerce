import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: [true, 'Please enter your store name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Store must have an owner'],
    },
    address: {
      type: String,
      required: [true, 'Please enter your store address'],
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one vendor can own only one store
storeSchema.index({ owner: 1 }, { unique: true });

const Store = mongoose.model('Store', storeSchema);

export default Store;
