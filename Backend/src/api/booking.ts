import express from "express";
import isAuthenticated from "./middleware/authentication-middleware";
import { createBooking, getMyBookings, getAllBookings } from "../application/booking";

const bookingRouter = express.Router();

// Create booking (authenticated users)
bookingRouter.post("/", isAuthenticated, createBooking);

// Get bookings of the logged-in user
bookingRouter.get("/me", isAuthenticated, getMyBookings);

// Get all bookings (public)
bookingRouter.get("/", getAllBookings);

export default bookingRouter;
