'use client'; 
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation


export default function QueryOutput(){
  const router = useRouter(); // Initialize the router
  const [midpointLat, setMidpointLat] = useState(null);
  const [midpointLong, setMidpointLong] = useState(null);
  const [textQuery, setTextQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const NEXT_JS_API_ROUTE_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";
  
  const performSearch = useCallback(async (lat, lon, query) => {
    if (!lat || !lon || !query) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
     
      const requestBody = {
        textQuery: query, 
        locationBias: {
          circle: {
            center: {
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
            },
            radius: 5000, // in meters (~3.1 miles)
          },
        },
        rankPreference: "DISTANCE",
        includedFields: ["formattedAddress", "displayName", "rating"],
      };
      
      console.log("Request Body: ", requestBody);

      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      console.log("Output", data.places);
      setResults(data.places || []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Something went wrong with the search.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if router.isReady (only for Pages Router, not strictly needed for App Router but harmless)
    // For App Router client components, router.query is not recommended.
    // Instead, use URLSearchParams on window.location.search directly.
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('midpointLat');
    const long = urlParams.get('midpointLong');
    const queryParam = urlParams.get('query');

    if (lat && long && queryParam) {
      setMidpointLat(parseFloat(lat));
      setMidpointLong(parseFloat(long));
      setTextQuery(queryParam);
      performSearch(lat, long, queryParam);
    } else {
      setError('Missing necessary query parameters (midpointLat, midpointLong, query).');
    }
  }, [performSearch]); // Dependency array: Re-run effect if performSearch changes (unlikely here)
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-2xl">
        
        <h1 className="text-3xl font-bold text-center sm:text-left">
          Results near the midpoint for "{textQuery}"
        </h1>
  
        {loading && <p className="text-blue-600">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
  
        {!loading && results.length > 0 && (
          <ul className="w-full space-y-4">
            {results.map((place, index) => (
              <li
                key={index}
                className="p-4 border rounded-lg shadow-md bg-white w-full"
              >
                <h2 className="text-xl font-semibold">{place.displayName?.text}</h2>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.formattedAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {place.formattedAddress}
                </a>

                {place.rating && (
                  <p className="text-sm text-gray-500">Rating: {place.rating} </p>
                )}
              </li>
            ))}
          </ul>
        )}
  
        {!loading && results.length === 0 && !error && (
          <p className="text-gray-600">No results found.</p>
        )}
      </main>
    </div>
  );  
}
