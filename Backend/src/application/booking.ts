import { Request, Response, NextFunction } from "express";
import Booking from "../infrastructure/entities/Booking";
import Hotel from "../infrastructure/entities/Hotel";
import ValidationError from "../domain/errors/validation-error";
import NotFoundError from "../domain/errors/not-found-error";
import { getAuth } from "@clerk/express";

// Helper function to calculate total price
const calculateTotalPrice = (checkIn: Date, checkOut: Date, basePrice: number): number => {
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  return nights * basePrice;
};

// Helper function to check room availability
const checkRoomAvailability = async (hotelId: string, roomNumber: number, checkIn: Date, checkOut: Date, excludeBookingId?: string): Promise<boolean> => {
  const query: any = {
    hotelId,
    roomNumber,
    status: { $in: ["CONFIRMED", "PENDING"] },
    $or: [
      {
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn }
      }
    ]
  };

  // Exclude current booking when updating
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBookings = await Booking.find(query);
  
  return conflictingBookings.length === 0;
};

// Create a new booking
export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { checkIn, checkOut, roomNumber, hotelId, guestCount = 1, specialRequests } = req.body;
    
    // Validate required fields
    if (!checkIn || !checkOut || !roomNumber || !hotelId) {
      throw new ValidationError("checkIn, checkOut, roomNumber, hotelId are required");
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      throw new ValidationError("Check-in date cannot be in the past");
    }

    if (checkOutDate <= checkInDate) {
      throw new ValidationError("Check-out date must be after check-in date");
    }

    // Validate guest count
    if (guestCount < 1 || guestCount > 10) {
      throw new ValidationError("Guest count must be between 1 and 10");
    }

    // Validate room number
    if (roomNumber < 1 || roomNumber > 999) {
      throw new ValidationError("Room number must be between 1 and 999");
    }

    // Find hotel and validate it exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) throw new NotFoundError("Hotel not found");

    // Check room availability
    const isAvailable = await checkRoomAvailability(hotelId, roomNumber, checkInDate, checkOutDate);
    if (!isAvailable) {
      throw new ValidationError("Room is not available for the selected dates");
    }

    const { userId } = getAuth(req);

    // Calculate total price (assuming hotel has a basePrice field)
    const basePrice = hotel.price || 100; // Default price if not set
    const totalPrice = calculateTotalPrice(checkInDate, checkOutDate, basePrice);

    const booking = await Booking.create({
      userId,
      hotelId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      roomNumber,
      guestCount,
      specialRequests,
      totalPrice,
      paymentStatus: "PENDING",
      status: "PENDING",
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

// Get bookings of the logged-in user
export const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getAuth(req);
    const bookings = await Booking.find({ userId }).populate("hotelId", "name location address");

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

// Get all bookings (for admin dashboard / public)
export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookings = await Booking.find({}).populate("hotelId", "name location address");

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

// Cancel a booking
export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const { userId } = getAuth(req);

    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    // Check if booking can be cancelled (not already cancelled or completed)
    if (booking.status === "CANCELLED") {
      throw new ValidationError("Booking is already cancelled");
    }

    if (booking.status === "COMPLETED") {
      throw new ValidationError("Cannot cancel a completed booking");
    }

    // Check if cancellation is within allowed timeframe (e.g., 24 hours before check-in)
    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 24) {
      throw new ValidationError("Cannot cancel booking within 24 hours of check-in");
    }

    booking.status = "CANCELLED";
    booking.paymentStatus = "REFUNDED";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    next(err);
  }
};

// Update a booking
export const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const { checkIn, checkOut, roomNumber, guestCount, specialRequests } = req.body;
    const { userId } = getAuth(req);

    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    // Check if booking can be updated
    if (booking.status === "CANCELLED") {
      throw new ValidationError("Cannot update a cancelled booking");
    }

    if (booking.status === "COMPLETED") {
      throw new ValidationError("Cannot update a completed booking");
    }

    // Validate dates if provided
    if (checkIn || checkOut) {
      const checkInDate = checkIn ? new Date(checkIn) : booking.checkIn;
      const checkOutDate = checkOut ? new Date(checkOut) : booking.checkOut;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        throw new ValidationError("Check-in date cannot be in the past");
      }

      if (checkOutDate <= checkInDate) {
        throw new ValidationError("Check-out date must be after check-in date");
      }

      // Check room availability for new dates if dates or room changed
      const newRoomNumber = roomNumber || booking.roomNumber;
      const isAvailable = await checkRoomAvailability(
        booking.hotelId.toString(),
        newRoomNumber,
        checkInDate,
        checkOutDate,
        bookingId // Exclude current booking from availability check
      );
      
      if (!isAvailable) {
        throw new ValidationError("Room is not available for the selected dates");
      }
    }

    // Update booking fields
    if (checkIn) booking.checkIn = new Date(checkIn);
    if (checkOut) booking.checkOut = new Date(checkOut);
    if (roomNumber) booking.roomNumber = roomNumber;
    if (guestCount) booking.guestCount = guestCount;
    if (specialRequests !== undefined) booking.specialRequests = specialRequests;

    // Recalculate total price if dates changed
    if (checkIn || checkOut) {
      const hotel = await Hotel.findById(booking.hotelId);
      const basePrice = hotel?.price || 100;
      booking.totalPrice = calculateTotalPrice(booking.checkIn, booking.checkOut, basePrice);
    }

    await booking.save();

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (err) {
    next(err);
  }
};

// Get booking by ID
export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const { userId } = getAuth(req);

    const booking = await Booking.findOne({ _id: bookingId, userId })
      .populate("hotelId", "name location address price");

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};
