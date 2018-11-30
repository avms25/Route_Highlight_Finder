//Response to Phase 2 assessment.
/*
Using any technology you want and the answer you gave on phase 1, implement an API (json) that receives the startingPoint and the EndPoint and returns a list of highlights.
For bonus points you could develop an endpoint that receives any lat long and returns the closest highlight. 
*/

// Taking start and end points' parameters.
var startPoint = process.argv[2];
var endPoint = process.argv[3];
var routePoints; // Points of the route, search from them.
var searchResults; // Holds an array of result objects returned by the nearbySearch query.
var highlights; // Array of the names of the highlights, limited to parks for this version.

// Creating the client object, used to call the Google API functionality.
const googleMapsClient = require('@google/maps').createClient({
  key: '' // Removed from the repository to avoid risk.
});

// Needed to process the route's points.
var polyline = require('@mapbox/polyline');

// Main functionality.
googleMapsClient.directions({
    origin: startPoint,
    destination: endPoint
}, function(err, response) {
  if (!err) {  
      route = response.json.routes[0]; // Main Route.
      // The decode operation returns an array of [lat, long] arrays, process these.
      routePoints = polyline.decode(route.overview_polyline.points);
      console.log("\nNumber of points: " + routePoints.length + "\nFirst Point: " + routePoints[0] + "\nLength of route: " + route.legs[0].distance.text);
      console.log("\n*****Highlights by name*****\n");
      
      for(var i = 0, x = 0; i < routePoints.length; i += 30, x++){ // Route iteration to find highlights, searches every 40 points of the route within a 2km radius for points of interest.
          googleMapsClient.placesNearby({
              location: routePoints[i],
              radius: 2000,
              //rankby: 'distance',
              type: 'park'
          }, function(err, response){
              if (!err){
                  searchResults = response.json.results; // Entire array of nearby parks.
                  console.log("Highlight found at [" + searchResults[0].geometry.location.lat + ", " + searchResults[0].geometry.location.lng + "]: " + searchResults[0].name);
                  highlights[x] = searchResults[0].name; // Main results by name.
              }
          })
      }
  }
      else
        console.log("ERROR: Place not found.\n");
});
