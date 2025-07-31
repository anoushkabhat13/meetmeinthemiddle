'use client';
import Image from "next/image";
import {useState,useEffect,useRef} from "react";
const libraries = ["places"];
import { useLoadScript } from "@react-google-maps/api";
import Link from 'next/link';
import { getMidpoint } from "./lib/midpoint.js";


export default function Home() {
  const [lat1, setLatitude1] = useState("");
  const [lng1, setLongitude1] = useState("");
  const [lat2, setLatitude2] = useState("");
  const [lng2, setLongitude2] = useState("");
  const [query, setQuery] = useState("");
  const [midpointLat, setMidpointLat] = useState("");
  const [midpointLong, setMidpointLong] = useState("");
  

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY_1,
    libraries,
  });
  
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);

  //use effect is code that runs after the component has rendered
  // This is where we set up the Google Maps Autocomplete functionality
  // In general useEffect is used to handle side effects in React components, such as fetching data, subscribing to events, or directly interacting with the DOM.
  useEffect(() => {
    if (!isLoaded || loadError) return;

    const options = {
      componentRestrictions: { country: "us" },
      fields: ["address_components", "geometry", "formatted_address"],
    };

    
    // Autocomplete for input 1
    const autocomplete1 = new google.maps.places.Autocomplete(inputRef1.current, options);
    autocomplete1.addListener("place_changed", () => {
      const place = autocomplete1.getPlace();
      if (place?.formatted_address) {
        setLatitude1(place.geometry.location.lat());
        setLongitude1(place.geometry.location.lng());
        console.log("Location 1 formatted: ", place.formatted_address);
        console.log("Latitude:", place.geometry.location.lat());
        console.log("Longitude:", place.geometry.location.lng());
      }
    });

    // Autocomplete for input 2
    const autocomplete2 = new google.maps.places.Autocomplete(inputRef2.current, options);
    autocomplete2.addListener("place_changed", () => {
      const place = autocomplete2.getPlace();
      if (place?.formatted_address) {
        setLatitude2(place.geometry.location.lat());
        setLongitude2(place.geometry.location.lng());
        console.log("Location 2 formatted: ", place.formatted_address);
        console.log("Latitude:", place.geometry.location.lat());
        console.log("Longitude:", place.geometry.location.lng());
      }
    });

    
    // Cleanup function to remove listeners
    return () => {
      google.maps.event.clearInstanceListeners(autocomplete1);
      google.maps.event.clearInstanceListeners(autocomplete2);
    };
  }, [isLoaded, loadError]);

  useEffect(() => {
    if (lat1 && lng1 && lat2 && lng2) {
      console.log("Inputs:", lat1, lng1, lat2, lng2);
      console.log("Types:", typeof lat1, typeof lng1); // should be number
      const { lat: midLat, lng: midLng } = getMidpoint(lat1, lng1, lat2, lng2);
      console.log("Lat Midpoint: ", midLat);
      console.log("Lng Midpoint: ", midLng);
      setMidpointLat(midLat); // Store as string for URL
      setMidpointLong(midLng); // Store as string
    } else {
      // Clear midpoint if any location is missing
      setMidpointLat("");
      setMidpointLong("");
    }
  }, [lat1, lng1, lat2, lng2]); // This effect runs when any of these state variables change



  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert mx-auto"
          src="/halfway.png"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="text-3xl/6 text-center sm:text-left leftfont-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Meet me Halfway{" "}
          </li>
        </ol>
        <>
          <input
            ref={inputRef1}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Location 1..."
          />
        </>
        
        <>
          <input
            ref={inputRef2}
            //was messing sonething up
            //value={location2}
            //onChange={e => setLocation2(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Location 2..."
          />
        </>

        <>
          <input
            onChange = {e => setQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="I'm looking for ..."
          />
        </>

        <>
          <Link
            href={{ pathname: "/query", query: { midpointLat, midpointLong, query} }}
            className="w-full max-w-md"  // <-- add this here
          >
            
            <button
              //even though button says full width the link wrapper is tiny
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!midpointLat || !midpointLong}
            >
              Go
            </button>
          </Link>

        </>

      </main>
    </div>
    
  );
  
}