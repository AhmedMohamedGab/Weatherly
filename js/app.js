import { fetchTheme, changeTheme, showHideXBtn, clearInput, showToast } from "./ui.js";

const APIKey = 'HZ6DR5BEU5FT5YH8JR5CBA4QL'; // visualcrossing API key

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

// on clicking on location button
locationBtn.addEventListener('click', () => {
    if ("geolocation" in navigator) {   // check if geolocation service is supported by the browser
        showToast('map-pin', 'Getting your location...');
        fetchWeatherData();
    } else {    // if geolocation service is not supported by the browser (in old browsers)
        alert("Geolocation is not supported by this browser.");
    }
});

// fetch weather data using visualcrossing API
async function fetchWeatherData() {
    try {
        const coordinates = await getLocation();    // Wait for getLocation Promise to resolve
        const [lat, lon] = coordinates;
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?key=${APIKey}&unitGroup=metric&elements=datetime,tempmax,tempmin,temp,feelslike,humidity,precipprob,windspeed,pressure,visibility,conditions,icon`);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        showToast('x', 'Could not get weather data.');
    }
}

// get user's location
function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve([latitude, longitude]);
            },
            (err) => {
                reject(showToast('x', 'Could not get your location. Please enable location access and try again.'));
            },
            {
                enableHighAccuracy: false, // start low accuracy for faster results
                timeout: 15000,            // wait up to 15s
                maximumAge: 0
            }
        );
    });
}