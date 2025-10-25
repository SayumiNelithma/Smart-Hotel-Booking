import { useParams, useNavigate } from "react-router";
import { useGetHotelByIdQuery, useCreateBookingMutation } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";

function HotelBookingPage() {
  const { _id } = useParams();
  const navigate = useNavigate();
  const { data: hotel, isLoading, isError, error } = useGetHotelByIdQuery(_id);
  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    roomNumber: "",
    guestCount: 1,
    specialRequests: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalPrice = () => {
    if (!formData.checkIn || !formData.checkOut || !hotel?.price) return 0;
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    return nights * hotel.price;
  };

  const validateForm = () => {
    const today = new Date().toISOString().split('T')[0];
    
    if (!formData.checkIn) {
      toast.error("Please select check-in date");
      return false;
    }
    
    if (formData.checkIn < today) {
      toast.error("Check-in date cannot be in the past");
      return false;
    }
    
    if (!formData.checkOut) {
      toast.error("Please select check-out date");
      return false;
    }
    
    if (formData.checkOut <= formData.checkIn) {
      toast.error("Check-out date must be after check-in date");
      return false;
    }
    
    if (!formData.roomNumber || formData.roomNumber < 1 || formData.roomNumber > 999) {
      toast.error("Please enter a valid room number (1-999)");
      return false;
    }
    
    if (formData.guestCount < 1 || formData.guestCount > 10) {
      toast.error("Guest count must be between 1 and 10");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const bookingData = {
        hotelId: _id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        roomNumber: Number(formData.roomNumber),
        guestCount: Number(formData.guestCount),
        specialRequests: formData.specialRequests
      };
      
      const result = await createBooking(bookingData).unwrap();
      toast.success("Booking created successfully!");
      navigate(`/booking-confirmation/${result._id}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create booking");
    }
  };

  if (isLoading) {
    return (
      <main className="px-4 py-6">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Hotel</h2>
        <p className="text-muted-foreground">{error?.data?.message || "Something went wrong."}</p>
      </div>
    );
  }

  return (
    <main className="px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Book {hotel.name}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="relative w-full h-[360px]">
            <img src={hotel.image} alt={hotel.name} className="absolute object-cover rounded-lg" />
          </div>
          <p className="text-muted-foreground mt-3">{hotel.description}</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Hotel Details</h3>
            <p className="text-sm text-gray-600">Location: {hotel.location}</p>
            <p className="text-sm text-gray-600">Price per night: ${hotel.price || 100}</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkIn">Check-in Date</Label>
                  <Input 
                    id="checkIn" 
                    name="checkIn" 
                    type="date" 
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">Check-out Date</Label>
                  <Input 
                    id="checkOut" 
                    name="checkOut" 
                    type="date" 
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input 
                    id="roomNumber" 
                    name="roomNumber" 
                    type="number" 
                    min="1" 
                    max="999"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 101"
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="guestCount">Number of Guests</Label>
                  <Input 
                    id="guestCount" 
                    name="guestCount" 
                    type="number" 
                    min="1" 
                    max="10"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <Textarea 
                  id="specialRequests" 
                  name="specialRequests" 
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special requests or notes..."
                  maxLength={500}
                  rows={3}
                />
              </div>
              
              {calculateTotalPrice() > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Price:</span>
                    <span className="text-xl font-bold text-blue-600">${calculateTotalPrice()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights × ${hotel.price || 100}/night
                  </p>
                </div>
              )}
              
              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? "Creating Booking..." : "Confirm Booking"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default HotelBookingPage;


