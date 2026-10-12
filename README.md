# Bangkok Stay Map

Public comparison of eight Bangkok group accommodation options for 13–16 December 2026, 15 adults and three nights.

The static site includes an interactive itinerary map and the public Google My Maps accommodation view. The OpenStreetMap/OSRM mode needs no API key. The Google Maps mode uses Maps JavaScript API + Routes API with a browser key and map ID in `maps-config.js`; it activates only when both are set. No backend or build step is needed. Publish the repository's main branch root using GitHub Pages.

## Files

- `index.html`, `styles.css`, `app.js`: responsive comparison page.
- `navigation.js`: directed origin/destination planning, encoded-road geometry decoding, and route-file loading.
- `google-maps.js`, `maps-config.js`: Google Maps renderer and Routes API adapter, with a domain-restricted browser key and JavaScript vector map ID.
- `terms.html`, `privacy.html`: public service terms and privacy information linked when Google Maps is enabled.
- `roads/`: precomputed OSRM driving paths for each home and each mainland itinerary point, with distance, duration, and snapped endpoints.
- `data.js`: sourced property information and the Google My Maps ID.
- `itinerary.js`: daily suggested stop order, approximate activity areas, sourced coordinates, and BKK departure.
- `vendor/leaflet.js`, `vendor/leaflet.css`: Leaflet 1.9.4, locally hosted. Basemap tiles are from OpenStreetMap with visible attribution.
- `itinerary-d12.kml` through `itinerary-d16.kml`: exportable daily places, lines, and areas.
- `bangkok-stays.kml`: eight map markers with source links and location-precision notes.

Airbnb coordinates are public approximate map positions, not confirmed entrance addresses. Two business markers come from public Google Maps listings. Quotes were checked on 8 October 2026 and can change. Unknown group rates remain explicitly unconfirmed.

To update positions, update `data.js` and the corresponding Google My Maps markers together. Do not publish private booking confirmations, personal contact information, or credentials in this repository.

Click a home to show routes to the visible itinerary points. Click a POI marker or its name to show routes from that POI to all eight homes. Bangkok destinations use public transportation, including walking to and from stations; Ban Phe and BKK use driving. Route directions are computed separately. Click a distance/time card or line to focus a single route; click its destination name to change the origin. Day filters limit POI destinations; Full Journey includes Ban Phe. The route toggle hides paths without hiding places or areas.

With blank Google configuration, displayed road paths use OSRM / OpenStreetMap. Each route also links to Google Maps with the same directed endpoints. OSRM paths were fetched on 12 October 2026 at no more than one request per second and served as static files, so visitors make no requests to the public OSRM demo service. Durations are model estimates without live traffic; Airbnb endpoints are approximate public positions and not verified entrances. No straight-line fallback is drawn for a missing route. Koh Samet beach and island-pier connections are marked as needing boat transfers rather than represented as continuous driving routes.

When Google configuration is enabled, all interactive markers, activity polygons and routes are rendered on a Google map. Routes are computed independently in the selected direction with at most two outstanding requests. Changing the origin abandons queued work and prevents stale results from painting. Results are held only for the current origin/display; no Google route payload is exported, stored in local storage, or written to the static road files. Transit requests include path and legs, prefer fewer transfers, and display total journey time, line names, walking distance, transfers and stop details. Google draws separate transit and walking segments with its own line styling. The departure selector is Bangkok local time (UTC+7), initially 10:00 on the selected itinerary date; changing the departure time invalidates prior transit results. It is a comparison time, not a confirmed itinerary departure. Dates are limited to Google's seven-day past / hundred-day future window. Driving requests do not pass transit preferences or a transit departure time. `trafficAware` remains false. Route warnings returned by Google are displayed with their route.

The Cloud project has Maps JavaScript API and Routes API enabled. The browser key is restricted to `https://fisftjc1-hub.github.io/*` and those two APIs. The loader uses origin-only authentication; a repository-path referrer restriction can fail because browsers redact paths on cross-origin requests. Use a separate key or referrer entry for any local testing. Monitor usage in Google Cloud; budget alerts alone are not spending caps. Do not publish unrestricted keys or other credentials.

Live provider validation on 12 October 2026 confirmed the Google vector map, three Nana-to-Sukhumvit transit routes, and eight Terminal-21-to-home transit routes for 15 December 2026, 10:00 Bangkok time. Walking, BTS, bus and rail-transfer results were returned. The departure-time refresh at 11:00 also returned all eight routes. Route-card focus and mouse-wheel zoom were checked in the deployed browser.

Activity polygons are approximate planning areas rather than walking isochrones. Distances to their boundaries remain explicitly labelled as straight-line distances. The 12/14 map uses plan A; massage and rooftop venues on 12/15 remain unspecified. Big C uses the Ratchadamri branch. Airport selection is Suvarnabhumi BKK, confirmed by the user; the source itinerary's 10:30 airport departure is displayed with the shopping schedule flagged for adjustment.

POI positions were checked on 12 October 2026 using OpenStreetMap geocoding, the restaurant's official map link, and Google Maps. The geocoder's Mega Bangna result pointed to another business and was rejected; the mall uses OSM way 175552840.

The original broad BKK marker did not snap to a public road within 300 metres. For driving navigation, BKK now uses the verified main passenger terminal, OSM way 26071844, at 13.6916193, 100.7510841. The calculated terminal endpoint snaps about 153 metres to the access-road network.

Mouse-wheel zoom is enabled. The default Bangkok overview retains a useful accommodation comparison scale; Full Journey includes the first day on Koh Samet and a conditional 13 December return to Bangkok. The 12 December view fits Ban Phe and the island without pulling the map back to Bangkok. Clicking a Bangkok property while viewing 12 December returns to the Bangkok overview.

Activity areas are selectable individually and deduplicated between days. Each area lists its itinerary stops; with a property selected, the card shows whether its public marker is inside or its approximate straight-line distance to the area boundary. These planning boundaries do not measure walking time or travel time.

Koh Samet positions use OSM beach way 96477683, Ao Phai node 617547920, Na Dan pier way 27622262, and Ban Phe node 2078709709. The initial Sai Kaew search returned a resort rather than the beach and was rejected. Na Dan is a transfer reference, not a confirmed boat booking. The original itinerary leaves the 12 December overnight location undecided; the return-transfer summary is conditional on staying on the island. Boat services and the exact Ban Phe departure pier remain undecided. Reference: https://www.samedresorts.com/transportation.html

Routing documentation and demo-server policy: https://project-osrm.org/docs/v5.24.0/api/ and https://github.com/Project-OSRM/osrm-backend/wiki/Demo-server . Road data uses OpenStreetMap; visible map attribution links to its copyright/licence information.
