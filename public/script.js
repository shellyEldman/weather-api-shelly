'use strict';

let firstSearch = true;
let redMarkerData = undefined;
const citiesData = new Map();

const greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconAnchor: [12, 41],
});

const redIcon = new L.Icon({  // red icon for selected city
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconAnchor: [12, 41],
});

setMap(citiesData);  // initialize citiesData

const mymap = L.map('mapid').setView([51.5073219, -0.1276474], 1.5);  // initialize map
L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2hlbGx5ZWxkbWFuIiwiYSI6ImNqdTViMjU2djBteHA0M3FrMHU5dGt1N3oifQ.qJXBcfoiA9Evyy5NFSx5XA`, {
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoic2hlbGx5ZWxkbWFuIiwiYSI6ImNqdTViMjU2djBteHA0M3FrMHU5dGt1N3oifQ.qJXBcfoiA9Evyy5NFSx5XA'
}).addTo(mymap);

citiesData.forEach((value) => {  // set up markers
    L.marker([value.lat, value.long], { icon: greenIcon }).addTo(mymap).on('click', (e) => findclickedCity(e.latlng));
});

const cities = [...document.querySelectorAll('.dropdown-item')];

cities.forEach(city => {  // handle city select by button (drop-down menu)
    city.addEventListener('click', function () {
        const cityName = this.textContent;
        handleClick(cityName);
    });
});

function handleClick(cityName) {  // handle button/marker click
    const cacheData = checkCache(cityName);
    if (cacheData) {
        setMapView(cacheData.cityData);
        handleData(cacheData.data, cityName, cacheData.cityData.country);
    } else {
        fetchData(cityName);
    }
}

function checkCache(cityName) {  // check if there is available data in the cache
    const cache = cacheJS.get({ city: cityName });
    if (cache !== null) {
        // if (Date.now() > cache.time + 1000 * 60 * 60 * 1) {  // check if 1 hour passed
        if (Date.now() > cache.time + 1000) {  // check if 1 hour passed
            return null;
        } else {
            return cache;
        }
    } else {
        return null;
    }
}

function fetchData(city) {  // fetch data from api when cache empty/old
    const cityData = citiesData.get(city);
    setMapView(cityData);
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityData.lat}&lon=${cityData.long}&units=metric&APPID=e0c47889761b3278ec2d153d93e085dc`)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            cacheJS.set({ city }, { data, cityData, time: Date.now() });
            handleData(data, city, cityData.country);
        })
        .catch(function (err) {
            console.log('Error: ', err);
        });
}

function setMapView(cityData) {  // display current selected city on the map
    if (redMarkerData) {  // remove previous red marker
        L.marker(redMarkerData, { icon: greenIcon }).addTo(mymap).on('click', (e) => findclickedCity(e.latlng));
    }
    L.marker([cityData.lat, cityData.long], { icon: redIcon }).addTo(mymap).on('click', (e) => findclickedCity(e.latlng));
    mymap.flyTo([cityData.lat, cityData.long], 7);
    redMarkerData = [cityData.lat, cityData.long];
}

function handleData(data, cityName, country) {  // update weather table data
    console.log('data', data);
    console.log('wind:', data.wind);
    const windDeg = data.wind.deg ? `, degrees: ${data.wind.deg}` : '';
    document.querySelector('.dropdown-toggle').textContent = cityName;
    document.querySelector('.cityName').textContent = cityName + ', ' + country;
    document.querySelector('.description span').textContent = data.weather[0].description;
    document.querySelector('.wind span').textContent = "speed: " + data.wind.speed + windDeg;
    document.querySelector('.temp span').textContent = data.main.temp + " Celsius";
    document.querySelector('.humidity span').textContent = data.main.humidity + "%";
    checkFirstSearch();
}

function checkFirstSearch() {  // display weather table on first search
    if (firstSearch) {
        firstSearch = false;
        document.querySelector('.result').classList.remove('d-none');
        document.querySelector('.result').classList.add('d-flex');
    }
}

function findclickedCity(latlng) {   // handle city select by marker clicking (map)
    for (let [key, value] of citiesData) {
        if ((value.lat === latlng.lat) && (value.long === latlng.lng)) {
            handleClick(key);
            break;
        }
    }
}

function setMap(citiesData) {  // set coordinates for each city to set up the markers
    citiesData.set('Tel Aviv', {
        lat: 32.0804808,
        long: 34.7805274,
        country: 'Israel'
    });
    citiesData.set('Brasilia', {
        lat: -10.3333333,
        long: -53.2,
        country: 'Brazil'
    });
    citiesData.set('Mumbai', {
        lat: 18.9387544,
        long: 72.8352382,
        country: 'India'
    });
    citiesData.set('Zanzibar', {
        lat: -6.0988563,
        long: 39.3204591,
        country: 'Tanzania'
    });
    citiesData.set('London', {
        lat: 51.5073219,
        long: -0.1276474,
        country: 'United Kingdom'
    });
    citiesData.set('New York', {
        lat: 40.7308619,
        long: -73.9871558,
        country: 'USA'
    });
    citiesData.set('Moscow', {
        lat: 55.7507178,
        long: 37.6176606,
        country: 'Russia'
    });
}