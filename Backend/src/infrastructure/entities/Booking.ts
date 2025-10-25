import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  roomNumber: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
    default: "PENDING",
  },
  status: {
    type: String,
    enum: ["CONFIRMED", "CANCELLED", "COMPLETED", "PENDING"],
    default: "PENDING",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true,
  },
  guestCount: {
    type: Number,
    default: 1,
    min: 1,
  },
  specialRequests: {
    type: String,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate unique booking reference before saving
bookingSchema.pre('save', function(next) {
  if (this.isNew && !this.bookingReference) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.bookingReference = `BK-${timestamp}-${random}`.toUpperCase();
  }
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
bookingSchema.index({ userId: 1 });
bookingSchema.index({ hotelId: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ bookingReference: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
