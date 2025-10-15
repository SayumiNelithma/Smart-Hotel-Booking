import React from "react";
import { useGetAllBookingsQuery } from "@/lib/api";

function formatDate(d) {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleDateString();
  } catch (e) {
    return d;
  }
}

export default function AdminBookingsPage() {
  // Fetch all bookings (no authentication required on backend)
  const { data: bookings, isLoading, isError, error } = useGetAllBookingsQuery();

  if (isLoading) return <main className="px-4 py-8">Loading bookings...</main>;
  if (isError)
    return (
      <main className="px-4 py-8">
        Error loading bookings: {error?.toString() || "Unknown error"}
      </main>
    );

  return (
    <main className="px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">All Bookings</h1>
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Hotel</th>
              <th className="px-4 py-2 text-left">User ID</th>
              <th className="px-4 py-2 text-left">Check In</th>
              <th className="px-4 py-2 text-left">Check Out</th>
              <th className="px-4 py-2 text-left">Room #</th>
              <th className="px-4 py-2 text-left">Payment</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings?.length > 0 ? (
              bookings.map((b) => (
                <tr key={b._id}>
                  <td className="px-4 py-2">
                    {b.hotelId?.name || (b.hotelId?._id || "-")}
                  </td>
                  <td className="px-4 py-2">{b.userId || "-"}</td>
                  <td className="px-4 py-2">{formatDate(b.checkIn)}</td>
                  <td className="px-4 py-2">{formatDate(b.checkOut)}</td>
                  <td className="px-4 py-2">{b.roomNumber || "-"}</td>
                  <td className="px-4 py-2">{b.paymentStatus || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-2 text-center">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
