# Bangkok Stay Map

Public comparison of eight Bangkok group accommodation options for 13–16 December 2026, 15 adults and three nights.

The static site includes an interactive itinerary map and the public Google My Maps accommodation view. It requires no API key, backend, or build step. Publish the repository's main branch root using GitHub Pages.

## Files

- `index.html`, `styles.css`, `app.js`: responsive comparison page.
- `data.js`: sourced property information and the Google My Maps ID.
- `itinerary.js`: daily suggested stop order, approximate activity areas, sourced coordinates, and BKK departure.
- `vendor/leaflet.js`, `vendor/leaflet.css`: Leaflet 1.9.4, locally hosted. Basemap tiles are from OpenStreetMap with visible attribution.
- `itinerary-d12.kml` through `itinerary-d16.kml`: exportable daily places, lines, and areas.
- `bangkok-stays.kml`: eight map markers with source links and location-precision notes.

Airbnb coordinates are public approximate map positions, not confirmed entrance addresses. Two business markers come from public Google Maps listings. Quotes were checked on 8 October 2026 and can change. Unknown group rates remain explicitly unconfirmed.

To update positions, update `data.js` and the corresponding Google My Maps markers together. Do not publish private booking confirmations, personal contact information, or credentials in this repository.

Itinerary lines show suggested movement between stops, not road geometry. Distances are great-circle distances from public property positions. Google directions links provide road/transit planning separately. Activity polygons are approximate planning areas rather than walking isochrones. The 12/14 map uses plan A; massage and rooftop venues on 12/15 remain unspecified. Big C uses the Ratchadamri branch. Airport selection is Suvarnabhumi BKK, confirmed by the user; the source itinerary's 10:30 airport departure is displayed with the shopping schedule flagged for adjustment.

POI positions were checked on 12 October 2026 using OpenStreetMap geocoding, the restaurant's official map link, and Google Maps. The geocoder's Mega Bangna result pointed to another business and was rejected; the mall uses OSM way 175552840.

Mouse-wheel zoom is enabled. The default Bangkok overview retains a useful accommodation comparison scale; Full Journey includes the first day on Koh Samet and a conditional 13 December return to Bangkok. The 12 December view fits Ban Phe and the island without pulling the map back to Bangkok. Clicking a Bangkok property while viewing 12 December returns to the Bangkok overview.

Activity areas are selectable individually and deduplicated between days. Each area lists its itinerary stops; with a property selected, the card shows whether its public marker is inside or its approximate straight-line distance to the area boundary. These planning boundaries do not measure walking time or travel time. The movement-line toggle keeps areas and places visible.

Koh Samet positions use OSM beach way 96477683, Ao Phai node 617547920, Na Dan pier way 27622262, and Ban Phe node 2078709709. The initial Sai Kaew search returned a resort rather than the beach and was rejected. Na Dan is a transfer reference, not a confirmed boat booking. The original itinerary leaves the 12 December overnight location undecided; the return line is conditional on staying on the island. Boat services and the exact Ban Phe departure pier remain undecided. Reference: https://www.samedresorts.com/transportation.html
