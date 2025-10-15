import HotelCard from "@/components/HotelCard";
import { useGetAllHotelsQuery, useGetAllLocationsQuery } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import LocationTab from "./LocationTab";
import { Skeleton } from "./ui/skeleton";
import { useSelector } from "react-redux";

// Helper function to apply AI filters to hotels
const applyAiFilters = (hotels, aiFilters, aiMatchedHotels = []) => {
  if (!aiFilters || !hotels) return hotels;
  
  console.log("Applying AI filters:", aiFilters);
  console.log("AI matched hotels:", aiMatchedHotels);
  console.log("Total hotels before filtering:", hotels.length);

  // If we have AI matched hotels, prioritize them and include them
  if (aiMatchedHotels && aiMatchedHotels.length > 0) {
    console.log("Using AI matched hotels as primary results");
    return aiMatchedHotels;
  }

  const filteredHotels = hotels.filter((hotel) => {
    // Price range filter
    if (aiFilters.priceRange.min !== null && hotel.price < aiFilters.priceRange.min) {
      return false;
    }
    if (aiFilters.priceRange.max !== null && hotel.price > aiFilters.priceRange.max) {
      return false;
    }

    // Location filter - more flexible matching
    if (aiFilters.location) {
      const hotelLocation = (hotel.location || "").toLowerCase();
      const filterLocation = aiFilters.location.toLowerCase();
      
      console.log(`Checking hotel "${hotel.name}" location: "${hotelLocation}" against filter: "${filterLocation}"`);
      
      // Check if location contains the filter term anywhere
      const locationMatch = hotelLocation.includes(filterLocation);
      
      // Also check if it's a country name and look for it in the last part of location (after comma)
      let countryMatch = false;
      if (['canada', 'usa', 'united states', 'mexico', 'france', 'italy', 'spain', 'germany', 'japan', 'china', 'australia', 'brazil', 'india', 'thailand', 'singapore', 'dubai'].includes(filterLocation)) {
        const locationParts = hotelLocation.split(',').map(part => part.trim());
        countryMatch = locationParts.some(part => part.includes(filterLocation));
      }
      
      if (!locationMatch && !countryMatch) {
        console.log(`Hotel "${hotel.name}" filtered out - location doesn't match`);
        return false;
      }
    }

    // Amenities filter
    if (aiFilters.amenities && aiFilters.amenities.length > 0) {
      const hotelAmenities = (hotel.amenities || []).map(a => a.toLowerCase());
      const hasRequiredAmenities = aiFilters.amenities.every(amenity => 
        hotelAmenities.some(hotelAmenity => hotelAmenity.includes(amenity.toLowerCase()))
      );
      if (!hasRequiredAmenities) {
        return false;
      }
    }

    // Rating filter
    if (aiFilters.rating && hotel.rating < aiFilters.rating) {
      return false;
    }

    // Keywords filter (search in name and description)
    if (aiFilters.keywords && aiFilters.keywords.length > 0) {
      const searchText = `${hotel.name} ${hotel.description || ""}`.toLowerCase();
      const hasKeywords = aiFilters.keywords.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );
      if (!hasKeywords) {
        return false;
      }
    }

    return true;
  });
  
  console.log("Hotels after filtering:", filteredHotels.length);
  return filteredHotels;
};

function HotelListings() {
  const [selectedLocation, setSelectedLocation] = useState(0);
  const aiFilters = useSelector((state) => state.search.aiFilters);
  const aiMatchedHotels = useSelector((state) => state.search.aiMatchedHotels);

  const {
    data: hotels,
    isLoading: isHotelsLoading,
    isError: isHotelsError,
    error: hotelsError,
  } = useGetAllHotelsQuery();

  const {
    data: locations,
    isLoading: isLocationsLoading,
    isError: isLocationsError,
    error: locationsError,
  } = useGetAllLocationsQuery();

  const allLocations = locations
    ? [{ _id: 0, name: "All" }, ...locations]
    : [{ _id: 0, name: "All" }];

  const handleLocationSelect = (selectedLocation) => {
    setSelectedLocation(selectedLocation._id);
  };

  const selectedLocationName = allLocations.find(
    (el) => selectedLocation === el._id
  ).name;

  // First apply location filter, then apply AI filters
  const locationFilteredHotels =
    selectedLocation === 0
      ? hotels
      : hotels.filter((hotel) => {
          const parts = (hotel.location || "").split(",");
          const country = parts[parts.length - 1]?.trim().toLowerCase();
          return country === selectedLocationName?.trim().toLowerCase();
        });

  // Apply AI filters to the location-filtered hotels
  console.log("Sample hotel locations:", hotels?.slice(0, 3).map(h => ({ name: h.name, location: h.location })));
  const filteredHotels = applyAiFilters(locationFilteredHotels, aiFilters, aiMatchedHotels);

  const isLoading = isHotelsLoading || isLocationsLoading;
  const isError = isHotelsError || isLocationsError;
  const error = [hotelsError, locationsError];

  if (isLoading) {
    return (
      <section className="px-8 py-8 lg:py-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top trending hotels worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover the most trending hotels worldwide for an unforgettable
            experience.
          </p>
        </div>

        <Skeleton className="h-6 flex items-center flex-wrap gap-x-4" />

        <Skeleton className="h-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="px-8 py-8 lg:py-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top trending hotels worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover the most trending hotels worldwide for an unforgettable
            experience.
          </p>
        </div>
        <p className="text-red-500">Error loading data </p>
      </section>
    );
  }

  return (
    <section className="px-8 py-8 lg:py-8">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Top trending hotels worldwide
        </h2>
        <p className="text-lg text-muted-foreground">
          Discover the most trending hotels worldwide for an unforgettable
          experience.
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-x-4">
        {allLocations.map((location) => {
          return (
            <LocationTab
              onClick={handleLocationSelect}
              location={location}
              selectedLocation={selectedLocation}
              key={location._id}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        {filteredHotels.map((hotel) => {
          return <HotelCard key={hotel._id} hotel={hotel} />;
        })}
      </div>
    </section>
  );
}

export default HotelListings;
