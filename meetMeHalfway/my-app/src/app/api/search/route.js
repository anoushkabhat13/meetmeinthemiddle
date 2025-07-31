// app/api/search/route.js
export async function POST(req) {
    try {
      const { textQuery, locationBias ,rankPreference} = await req.json();
      const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating",
        },
        body: JSON.stringify({
          textQuery,
          locationBias,
          rankPreference,
        }),
      });
  
      const data = await response.json();
      return Response.json({ places: data.places || [] });
    } catch (err) {
      console.error("API Route Error:", err);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
      });
    }
  }
  