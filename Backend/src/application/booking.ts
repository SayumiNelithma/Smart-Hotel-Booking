import { Request, Response, NextFunction } from "express";
import Booking from "../infrastructure/entities/Booking";
import Hotel from "../infrastructure/entities/Hotel";
import ValidationError from "../domain/errors/validation-error";
import NotFoundError from "../domain/errors/not-found-error";
import { getAuth } from "@clerk/express";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { checkIn, checkOut, roomNumber, hotelId } = req.body;
    if (!checkIn || !checkOut || !roomNumber || !hotelId) {
      throw new ValidationError("checkIn, checkOut, roomNumber, hotelId are required");
    }
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) throw new NotFoundError("Hotel not found");
    const { userId } = getAuth(req);
    const booking = await Booking.create({
      userId,
      hotelId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      roomNumber,
      paymentStatus: "PENDING",
    });
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

export const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);
    const bookings = await Booking.find({ userId }).populate("hotelId");
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};


