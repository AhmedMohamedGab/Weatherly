import { fetchTheme, changeTheme, showHideXBtn, clearInput, showToast, renderWeatherData } from "./ui.js";

const VISUALCROSSING_API_KEY = 'HZ6DR5BEU5FT5YH8JR5CBA4QL'; // VisualCrossing API key
const OPENCAGE_API_KEY = '3eb39a10f53b422088b9c1db22513124'; // OpenCage API key

const themeBtn = document.getElementById('theme-btn');  // theme button
const searchInput = document.getElementById('search-input');  // search box
const xBtn = document.getElementById('x-btn');  // x button
const locationBtn = document.getElementById('location-btn');  // location button

// on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchTheme();   // fetch theme from local storage
    lucide.createIcons();   // update icons
});

// on clicking on theme button
themeBtn.addEventListener('click', changeTheme);

// on typing in search box
searchInput.addEventListener('keyup', showHideXBtn);

// on clicking on x button
xBtn.addEventListener('click', clearInput);

// get user's location
function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve([latitude, longitude]);
            },
            (err) => {
                reject(showToast('map-pin-off', 'Could not get your location. Please enable location access and try again.'));
            },
            {
                enableHighAccuracy: false, // start low accuracy for faster results
                timeout: 15000,            // wait up to 15s
                maximumAge: 0
            }
        );
    });
}

// resolve user's address from coordinates using OpenCage Geocoding API
async function getAddressFromCoordinates(lat, lon) {
    try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`);
        const data = await response.json();
        if (response.status === 200 && data.results.length > 0) {
            const address = data.results[0].components.city || data.results[0].components.county ||
                data.results[0].components.state || data.results[0].components.country;
            return address;
        } else {
            showToast('map-pin-x', 'Could not resolve address from coordinates.');
            return null;
        }
    } catch (error) {
        showToast('circle-x', 'Error resolving address from coordinates.');
        return null;
    }
}

// fetch weather data using visualcrossing API
async function fetchWeatherData() {
    try {
        const coordinates = await getLocation();    // Wait for getLocation Promise to resolve
        const [lat, lon] = coordinates;
        const address = await getAddressFromCoordinates(lat, lon);
        if (!address) {
            return;
        }
        showToast('cloud-download', 'Fetching weather data...');
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${address}?key=${VISUALCROSSING_API_KEY}&unitGroup=metric&elements=datetime,tempmax,tempmin,temp,feelslike,humidity,precipprob,windspeed,pressure,visibility,conditions,icon`);
        const data = await response.json();
        if (response.status === 200) {
            renderWeatherData(data);
            showToast('circle-check-big', 'Weather fetched successfully!');
        } else if (response.status === 400) {
            showToast('map-pin-x', 'Invalid location! check the spelling.');
        } else {
            showToast('server-off', 'Server error! Try again later.');
        }
    } catch (error) {
        showToast('circle-x', 'Could not get weather data.');
    }
}

// on clicking on location button
locationBtn.addEventListener('click', () => {
    if ("geolocation" in navigator) {   // check if geolocation service is supported by the browser
        showToast('pin', 'Getting your location...');
        fetchWeatherData();
    } else {    // if geolocation service is not supported by the browser (in old browsers)
        alert("Geolocation is not supported by this browser.");
    }
});