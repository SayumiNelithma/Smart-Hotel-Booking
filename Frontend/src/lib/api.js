import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export { getAllHotels, getAllLocations };

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
    prepareHeaders: async (headers) => {
      return new Promise((resolve) => {
        async function checkToken() {
          const clerk = window.Clerk;
          if (clerk) {
            const token = await clerk.session?.getToken();
            // Only set Authorization header when a valid token string is returned
            if (token) {
              headers.set("Authorization", `Bearer ${token}`);
            }
            resolve(headers);
          } else {
            setTimeout(checkToken, 500);
          }
        }
        checkToken();
      });
    },
  }),
  endpoints: (build) => ({
    getAllHotels: build.query({
      query: () => "hotels",
      providesTags: (result, error, id) => [{ type: "Hotels", id: "LIST" }],
    }),
    getHotelsBySearch: build.query({
      query: (search) => `hotels/search?query=${search}`,
      providesTags: (result, error, id) => [{ type: "Hotels", search }],
    }),
    getHotelById: build.query({
      query: (id) => `hotels/${id}`,
      providesTags: (result, error, id) => [{ type: "Hotels", id }],
    }),
    createHotel: build.mutation({
      query: (hotel) => ({
        url: "hotels",
        method: "POST",
        body: hotel,
      }),
      invalidatesTags: (result, error, id) => [{ type: "Hotels", id: "LIST" }],
    }),
    getAllLocations: build.query({
      query: () => "locations",
      providesTags: (result, error, id) => [{ type: "Locations", id: "LIST" }],
    }),
    addLocation: build.mutation({
      query: (location) => ({
        url: "locations",
        method: "POST",
        body: {
          name: location.name,
        },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Locations", id: "LIST" },
      ],
    }),
    addReview: build.mutation({
      query: (review) => ({
        url: "reviews",
        method: "POST",
        body: review,
      }),
      // use the original argument (arg) to determine which hotel to invalidate
      invalidatesTags: (result, error, arg) => [
        { type: "Hotels", id: arg.hotelId },
      ],
    }),
    // AI search endpoint on backend: POST /api/hotels/ai
    // Accepts payload: { query: string, preferences?: object, filters?: object }
    aiSearch: build.mutation({
      query: (payload) => ({
        url: "hotels/ai",
        method: "POST",
        body: payload,
      }),
    }),
    // Create booking endpoint: POST /api/bookings
    createBooking: build.mutation({
      query: (booking) => ({
        url: "bookings",
        method: "POST",
        body: booking,
      }),
      // use the original argument (arg) so we don't reference an undefined variable
      invalidatesTags: (result, error, arg) => [{ type: "Hotels", id: arg.hotelId }],
    }),
    // Admin: get all bookings
    getAllBookings: build.query({
      query: () => `bookings`,
      providesTags: (result, error, id) =>
        result ? result.map((b) => ({ type: "Bookings", id: b._id })) : [{ type: "Bookings", id: "LIST" }],
    }),
    // Get bookings for the authenticated user
    getMyBookings: build.query({
      query: () => `bookings/me`,
      providesTags: (result, error, id) =>
        result ? result.map((b) => ({ type: "Bookings", id: b._id })) : [{ type: "Bookings", id: "LIST" }],
    }),
    // Get reviews for a hotel: GET /api/reviews/hotel/:hotelId
    getReviewsForHotel: build.query({
      query: (hotelId) => `reviews/hotel/${hotelId}`,
      providesTags: (result, error, id) =>
        result ? result.map((r) => ({ type: "Reviews", id: r._id })) : [{ type: "Reviews", id: "LIST" }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllHotelsQuery,
  useGetHotelByIdQuery,
  useGetHotelsBySearchQuery,
  useCreateHotelMutation,
  useAddLocationMutation,
  useGetAllLocationsQuery,
  useAddReviewMutation,
  useAiSearchMutation,
  useCreateBookingMutation,
  useGetAllBookingsQuery,
  useGetMyBookingsQuery,
  useGetReviewsForHotelQuery,
} = api;