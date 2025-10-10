import express from "express";
import { createBooking, getMyBookings } from "../application/booking";
import isAuthenticated from "./middleware/authentication-middleware";

const bookingRouter = express.Router();

bookingRouter.route("/")
  .post(isAuthenticated, createBooking);

bookingRouter.route("/me")
  .get(isAuthenticated, getMyBookings);

export default bookingRouter;


