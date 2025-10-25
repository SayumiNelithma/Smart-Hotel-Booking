import express from "express";
import isAuthenticated from "./middleware/authentication-middleware";
import { 
  createBooking, 
  getMyBookings, 
  getAllBookings, 
  cancelBooking, 
  updateBooking, 
  getBookingById 
} from "../application/booking";

const bookingRouter = express.Router();

// Create booking (authenticated users)
bookingRouter.post("/", isAuthenticated, createBooking);

// Get bookings of the logged-in user
bookingRouter.get("/me", isAuthenticated, getMyBookings);

// Get all bookings (public)
bookingRouter.get("/", getAllBookings);

// Get specific booking by ID (authenticated users)
bookingRouter.get("/:bookingId", isAuthenticated, getBookingById);

// Cancel a booking (authenticated users)
bookingRouter.patch("/:bookingId/cancel", isAuthenticated, cancelBooking);

// Update a booking (authenticated users)
bookingRouter.patch("/:bookingId", isAuthenticated, updateBooking);

export default bookingRouter;
