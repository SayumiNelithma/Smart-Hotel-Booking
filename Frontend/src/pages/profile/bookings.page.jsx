import React from "react";
import { useGetMyBookingsQuery } from "@/lib/api";

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString();
  } catch (e) {
    return d;
  }
}

export default function ProfileBookingsPage() {
  const { data: bookings, isLoading, isError, error } = useGetMyBookingsQuery();

  if (isLoading) return <main className="px-4 py-8">Loading your bookings...</main>;
  if (isError) return <main className="px-4 py-8">Error loading bookings: {error?.toString()}</main>;

  return (
    <main className="px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Hotel</th>
              <th className="px-4 py-2 text-left">Check In</th>
              <th className="px-4 py-2 text-left">Check Out</th>
              <th className="px-4 py-2 text-left">Room #</th>
              <th className="px-4 py-2 text-left">Payment</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings?.map((b) => (
              <tr key={b._id}>
                <td className="px-4 py-2">{b.hotelId?.name || "-"}</td>
                <td className="px-4 py-2">{formatDate(b.checkIn)}</td>
                <td className="px-4 py-2">{formatDate(b.checkOut)}</td>
                <td className="px-4 py-2">{b.roomNumber}</td>
                <td className="px-4 py-2">{b.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
