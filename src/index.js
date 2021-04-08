// impor
import "./style.css";

const axios = require('axios');
//Use require('lodash') if you need other package
var _get = require('lodash/get');

document.getElementById("info-card").hidden = true;

//Google maps Implementation
window.initMap = initMap;
function initMap() {
  
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 45.4642, lng: 9.1900 },
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: false,
    fullscreenControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var infoWindow = new google.maps.InfoWindow({ map: map });

  //User location Button
  var locationButton = document.getElementById("button");
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('You are here.');
        map.setCenter(pos);
        console.log(pos.lat, pos.lng);
        
        getData(pos.lat, pos.lng);
      }, function () {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });


  // Search Box 
  var input = document.getElementById('searchInput');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      getData(place.geometry.location.lat(), place.geometry.location.lng());
      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);

  });

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

//Api Call
async function getData(lat, lng) {
  // Use dotenv to hide your API KEY
  const kenTo = process.env.API_KEY;
  const lat_query = lat;
  const lng_query = lng;
  const api_url = `https://api.waqi.info/feed/geo:${lat_query};${lng_query}/?token=${kenTo}`;

  axios.get(api_url)
    .then(function (response){
      const data = response.data;
      //Api request can return a status error
      data.status == "ok" ? _showData(data) : errorApiHandler(data.data);  
    })
    .catch (function (error) {
      errorApiHandler(error);
    })
  };
//Error Handler in case of bad request   
function errorApiHandler(error){ 
  console.log(error);
  document.getElementById("info-card").hidden= false;
  document.getElementById("info-card").innerHTML= "";
  document.getElementById("info-card").innerHTML= "Something went wrong, search another city or try again later";
}

//Display data on the info-card div
function _showData(data) {
  //Using API data
  data = data.data;
  const aqi = _get(data,'aqi', -1);
  const station = _get(data,'city.name', 'Station information not available');
  const stationLinkName = _get(data, 'attributions[0].name', 'Link not available');
  const stationLink= _get(data, 'attributions[0].url', '#'); 
  const indexNumb = document.getElementById('aqi-number');
  const attributions = document.getElementById('attributions');
  const listRow = document.getElementById('listRow');
  const healtMsg = document.getElementById('health-msg');

  listRow.innerHTML = '';

  //AQI Data Creation
  indexNumb.classList = [];
  indexNumb.classList.add(_aqiStatus(aqi));

  healtMsg.innerHTML = _getHealthMsg(aqi);

  document.getElementById('indice').innerHTML = aqi;
  document.getElementById('citta').innerHTML = station;
  document.getElementById("info-card").style.display = "flex";

  attributions.innerText = stationLinkName;
  attributions.href = stationLink;
  //More Data Creation
  for (let iaqiType in data.iaqi) {
    if (data.iaqi.hasOwnProperty(iaqiType) && _getTitle(iaqiType)) {
      const details = document.createElement('div');
      details.classList.add('details');

      const iaqiNumber = document.createElement('div');
      iaqiNumber.classList.add('iaqi', _aqiStatus(data.iaqi[iaqiType].v));
      iaqiNumber.innerHTML = data.iaqi[iaqiType].v;

      const title = document.createElement('div');
      title.classList.add('main-title');
      title.innerText = _getTitle(iaqiType);

      details.appendChild(iaqiNumber);
      details.appendChild(title);
      listRow.appendChild(details);
    }

  }
}

//Returns the class name based on aqi level this is used in css to render colors for every aqi level

function _aqiStatus(aqi) {
  if (aqi == -1)
    return 'N/A';
  else if (aqi <= 50)
    return 'good';
  else if (aqi <= 100)
    return 'moderate';
  else if (aqi <= 150)
    return 'USG';
  else if (aqi <= 200)
    return 'unhealthy';
  else if (aqi <= 300)
    return 'VU';
  else
    return 'hazardous';
}

//Gets the title of the pollutant based on short name 
function _getTitle(shortname) {
  if (shortname == 'co')
    return 'Carbon Monoxide';
  else if (shortname == 'h')
    return 'Hydrogen';
  else if (shortname == 'no2')
    return 'Nitrogen Oxide';
  else if (shortname == 'o3')
    return 'Ozone';
  else if (shortname == 'pm10')
    return 'PM (1.0)';
  else if (shortname == 'pm25')
    return 'PM (2.5)';
  else if (shortname == 'so2')
    return 'Sulphur Dioxide';
  else
    return null;
}
//Gets the health advisory message based of the aqi level 
function _getHealthMsg(aqi) {
  if (aqi <= 50)
    return 'No Risk, enjoy your day!';
  else if (aqi <= 100)
    return 'Small concern for people sensitive to air pollution.';
  else if (aqi <= 150)
    return 'Children & Senior groups may experience health effects.';
  else if (aqi <= 200)
    return 'Everyone may begin to experience health effects.';
  else if (aqi <= 300)
    return 'Everyone may experience more serious health effects.';
  else
    return 'Health warnings and emergency conditions.';

}

