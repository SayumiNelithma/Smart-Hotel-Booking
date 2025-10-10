import { useParams, useNavigate } from "react-router";
import { useGetHotelByIdQuery, useCreateBookingMutation } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

function HotelBookingPage() {
  const { _id } = useParams();
  const navigate = useNavigate();
  const { data: hotel, isLoading, isError, error } = useGetHotelByIdQuery(_id);
  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const checkIn = formData.get("checkIn");
    const checkOut = formData.get("checkOut");
    const roomNumber = Number(formData.get("roomNumber"));
    if (!checkIn || !checkOut || !roomNumber) return;
    try {
      await createBooking({ hotelId: _id, checkIn, checkOut, roomNumber }).unwrap();
      toast.success("Booking created");
      navigate(`/hotels/${_id}`);
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
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="checkIn">Check-in</Label>
                <Input id="checkIn" name="checkIn" type="date" required />
              </div>
              <div>
                <Label htmlFor="checkOut">Check-out</Label>
                <Input id="checkOut" name="checkOut" type="date" required />
              </div>
              <div>
                <Label htmlFor="roomNumber">Room number</Label>
                <Input id="roomNumber" name="roomNumber" type="number" min="1" required />
              </div>
              <Button type="submit" disabled={isCreating}>{isCreating ? "Booking..." : "Confirm Booking"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default HotelBookingPage;


