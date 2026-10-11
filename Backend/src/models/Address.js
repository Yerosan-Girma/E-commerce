import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Address must belong to a user'],
    },
    label: {
      type: String,
      trim: true,
      default: 'Address',
    },
    country: {
      type: String,
      required: [true, 'Please provide country'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    street: {
      type: String,
      required: [true, 'Please provide street address'],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, 'Please provide postal code'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster user-based lookups
addressSchema.index({ user: 1 });

const Address = mongoose.model('Address', addressSchema);

export default Address;
