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

// Store owner index (not unique - vendors can have multiple stores if needed)
storeSchema.index({ owner: 1 });

const Store = mongoose.model('Store', storeSchema);

export default Store;
