// (function() {

'use strict';

// const GOOGLE_MAPS_APIKEY = ''; // No API key for public API access
// const GOOGLE_MAPS_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const IPINFO_URL = 'http://ipinfo.io';
const OPEN_WEATHER_APIKEY = 'ca7bba137aee214dde7d3062ae615210';
const OPEN_WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather'; // No SSL for free account; will anger Chrome

var $location = $('#location');
var $currentTemp = $('#temp-value');
var $icon = $('#icon');
var $desc = $('#description');
var $minTemp = $('#range-min');
var $maxTemp = $('#range-max');
var $units = $('#temp-units');
var $advice = $('#advice');

var weather = {
  _advice: undefined,
  _currentTemp: undefined,
  _desc: {
    'main': undefined,
    'detail': undefined
  },
  _icon: undefined,
  _maxTemp: undefined,
  _minTemp: undefined,
  _units: undefined,
  convertTempUnits: function() {
    if (this.getUnits() === 'F') {
      var tempC = (this.getCurrentTemp() - 32) / 1.8;
      var unitsC = 'C';
      var minTempC = (this.getMinTemp() - 32) / 1.8;
      var maxTempC = (this.getMaxTemp() - 32) / 1.8;

      this.setCurrentTemp(tempC);
      this.setUnits(unitsC);
      this.setMinTemp(minTempC);
      this.setMaxTemp(maxTempC);
    } else {
      var tempF = (this.getCurrentTemp() * 1.8) + 32;
      var unitsF = 'F';
      var minTempF = (this.getMinTemp() * 1.8) + 32;
      var maxTempF = (this.getMaxTemp() * 1.8) + 32;

      this.setCurrentTemp(tempF);
      this.setUnits(unitsF);
      this.setMinTemp(minTempF);
      this.setMaxTemp(maxTempF);
    }
  },
  getAdvice: function() {
    return this._advice;
  },
  getCurrentTemp: function() {
    return this._currentTemp;
  },
  getDesc: function() {
    return this._desc;
  },
  getIcon: function() {
    return this._icon;
  },
  getMaxTemp: function() {
    return this._maxTemp;
  },
  getMinTemp: function() {
    return this._minTemp;
  },
  getUnits: function() {
    return this._units;
  },
  setAdvice: function(loc) {
    var url = 'https://openweathermap.org/city/' + loc;
    var newAdvice = '<a href="' + url + '" target="_blank">' + 'Need a more detailed weather forecast?' + '</a>';
    // var currentTemp = this.getCurrentTemp();
    //
    // if (currentTemp < 40) {
    //   newAdvice = 'It\'s fucking cold.';
    // }
    //
    // else if (currentTemp > 40 && currentTemp < 80) {
    //   newAdvice = 'It\'s fucking...pleasant.';
    // }
    //
    // else if (currentTemp > 80) {
    //   newAdvice = 'It\'s fucking hot.';
    // }
    //
    // else {
    //   newAdvice = 'Good luck, chump. I\'ve got nothing for you.';
    // }

    this._advice = newAdvice;
  },
  setCurrentTemp: function(newTemp) {
    this._currentTemp = newTemp;
  },
  setDesc: function(newDescMain, newDescDetail) {
    this._desc['main'] = newDescMain;
    this._desc['detail'] = newDescDetail;
  },
  setIcon: function(newIcon) {
    var newIconPath = './images/icons/';
    var newIconFileName = newIcon.toString().toLowerCase() + '.png';
    this._icon = newIconPath + newIconFileName;
  },
  setMaxTemp: function(newTemp) {
    this._maxTemp = newTemp;
  },
  setMinTemp: function(newTemp) {
    this._minTemp = newTemp;
  },
  setUnits: function(newUnits) {
    this._units = newUnits;
  }
};

// function geoLocError() {
//   // TODO
//   alert('Your browser failed to determine your geolocation coordinates!');
// }

// function geoLocSuccess(position, callback) {
//   var latitude = position.coords.latitude;
//   var longitude = position.coords.longitude;
//
//   requestTemp(latitude, longitude);
//   requestCityState(latitude, longitude);
// }

function requestTemp(latitude, longitude) {
  var requestTempObj = {
    data: {
      appid: OPEN_WEATHER_APIKEY,
      lat: latitude,
      lon: longitude,
      units: 'imperial'
    },
    dataType: 'json',
    type: 'GET',
    url: OPEN_WEATHER_URL
  };

  jQuery.ajax(requestTempObj)
        .done(requestTempSuccess)
        .fail(requestTempError);
}

// function requestCityState(latitude, longitude) {
//   var latlng = latitude.toString() + ',' + longitude.toString();
//   var requestCityStateObj = {
//     data: {
//       latlng: latlng,
//       sensor: false // What does this flag do?
//     },
//     dataType: 'json',
//     type: 'GET',
//     url: GOOGLE_MAPS_URL
//   };
//
//   jQuery.ajax(requestCityStateObj)
//         .done(requestCityStateSuccess)
//         .fail(requestCityStateError);
// }

// function requestCityStateSuccess(json) {
//   var address = json.results[0].address_components;
//   var city = address[2].short_name;
//   var state = address[4].short_name;
//   var cityStateStr = city + ', ' + state;
//
//   $location.html(cityStateStr);
// }

// function requestCityStateError(xhr, status, error) {
//   // TODO
//   alert('The request for your location\'s city and state failed!');
// }

function requestTempSuccess(json) {
  var currentTemp = json.main.temp;
  var currentUnits = 'F';
  var descMain = json.weather[0].main; // e.g., "Clouds"
  var descDetail = json.weather[0].description; // e.g., "Overcast Clouds"
  var minTemp = json.main.temp_min;
  var maxTemp = json.main.temp_max;
  var locId = json.id;

  weather.setCurrentTemp(currentTemp);
  weather.setUnits(currentUnits);
  weather.setIcon(descMain);
  weather.setDesc(descMain, descDetail);
  weather.setMinTemp(minTemp);
  weather.setMaxTemp(maxTemp);
  weather.setAdvice(locId);

  updateTemp();
}

function requestTempError(xhr, status, error) {
    // TODO
    alert('The request for your location\'s weather failed!');
}

function updateTemp() {
  var currentTempHTMLStr = Math.round(weather.getCurrentTemp()).toString();
  $currentTemp.html(currentTempHTMLStr);
  var currentUnitsHTMLStr = '&deg;' + weather.getUnits().toString();
  $units.html(currentUnitsHTMLStr);
  var currentIconSrc = weather.getIcon();
  $icon.attr('src', currentIconSrc);
  var descHTMLStr = weather.getDesc()['detail'].toString();
  $desc.html(descHTMLStr);
  var minTempHTMLStr = 'MIN ' + Math.round(weather.getMinTemp()).toString() + '&deg;';
  $minTemp.html(minTempHTMLStr);
  var maxTempHTMLStr = 'MAX ' + Math.round(weather.getMaxTemp()).toString() + '&deg;';
  $maxTemp.html(maxTempHTMLStr);
  var adviceHTMLStr = weather.getAdvice();
  $advice.html(adviceHTMLStr);
}

$units.on('click', function swapUnits() {
  weather.convertTempUnits();
  updateTemp();
});

function getGeoLoc() {
    var geoLocObj = {
      dataType: 'json',
      type: 'GET',
      url: IPINFO_URL
    };

    jQuery.ajax(geoLocObj)
          .done(getGeoLocSuccess)
          .fail(getGeoLocError);
}

function getGeoLocSuccess(json) {
  var lat = json.loc.split(',')[0].toString();
  var lng = json.loc.split(',')[1].toString();
  requestTemp(lat, lng);

  var city = json.city.toString();
  var country = json.country.toString();
  var locStr = city + ', ' + country;
  $location.html(locStr);
}

function getGeoLocError(xhr, status, error) {
  // TODO
  alert('The request for your geolocation failed!');
}

function initApp() {
  getGeoLoc();
}

// APP START
initApp();

// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(geoLocSuccess, geoLocError);
// } else {
//   // TODO
//   alert('Your browser does not support the navigator.geolocation object!');
// }

// }());
