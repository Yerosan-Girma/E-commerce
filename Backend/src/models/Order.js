import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Order item must have a product'],
    },
    title: {
      type: String,
      required: [true, 'Order item must have a title'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    price: {
      type: Number,
      required: [true, 'Order item must have a price'],
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user'],
    },
    orderItems: {
      type: [orderItemSchema],
      required: [true, 'Order must have items'],
    },
    shippingAddress: {
      fullName: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'Please provide shipping address'],
      },
      city: {
        type: String,
        required: [true, 'Please provide city'],
      },
      state: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: String,
        required: [true, 'Please provide postal code'],
      },
      country: {
        type: String,
        required: [true, 'Please provide country'],
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    paymentMethod: {
      type: String,
      required: [true, 'Please provide payment method'],
      enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
    },
    itemsPrice: {
      type: Number,
      required: [true, 'Please provide items price'],
      min: [0, 'Items price cannot be negative'],
      default: 0,
    },
    taxPrice: {
      type: Number,
      required: [true, 'Please provide tax price'],
      min: [0, 'Tax price cannot be negative'],
      default: 0,
    },
    shippingPrice: {
      type: Number,
      required: [true, 'Please provide shipping price'],
      min: [0, 'Shipping price cannot be negative'],
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: [true, 'Please provide total price'],
      min: [0, 'Total price cannot be negative'],
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes optimized for analytics aggregation pipelines
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ status: 1, totalPrice: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'orderItems.product': 1 });
orderSchema.index({ 'orderItems.product': 1, status: 1 });
orderSchema.index({ 'orderItems.product': 1, status: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
