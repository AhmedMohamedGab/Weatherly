// import UI control functions
import { fetchTheme, changeTheme, showHideXBtn, clearInput, showToast, renderWeatherData } from "./ui.js";

// API keys
const VISUALCROSSING_API_KEY = 'HZ6DR5BEU5FT5YH8JR5CBA4QL'; // VisualCrossing API key
const OPENCAGE_API_KEY = '3eb39a10f53b422088b9c1db22513124'; // OpenCage API key

// DOM elements
const themeBtn = document.getElementById('theme-btn');  // theme button
const searchInput = document.getElementById('search-input');  // search box
const xBtn = document.getElementById('x-btn');  // x button
const locationBtn = document.getElementById('location-btn');  // location button

// on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchTheme();   // fetch theme from local storage

    // get weather for user's location
    if ("geolocation" in navigator) {   // check if geolocation service is supported by the browser
        showToast('pin', 'Getting your location...');   // toast message
        getWeatherForCoordinates(); // get user's location and address and fetch weather data
    } else {    // if geolocation service is not supported by the browser (in old browsers)
        alert("Geolocation is not supported by this browser."); // alert message
    }

    lucide.createIcons();   // update icons
});

// on clicking on theme button => change theme
themeBtn.addEventListener('click', changeTheme);

// on typing in search box => show or hide x button
searchInput.addEventListener('keyup', showHideXBtn);

// on clicking on x button => clear search box input
xBtn.addEventListener('click', clearInput);

// get user's coordinates using Geolocation API
function getCoordinates() {
    // Return a new Promise that resolves with the coordinates
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => { // on success
                const { latitude, longitude } = position.coords;    // extract latitude and longitude
                resolve([latitude, longitude]); // resolve the Promise with coordinates
            },
            (err) => {  // on error => reject the Promise with error message
                reject(showToast('map-pin-off', 'Could not get your location. Please enable location access and try again.'));
            },
            {
                // performance options
                enableHighAccuracy: false, // start low accuracy for faster results
                timeout: 15000, // wait up to 15s
                maximumAge: 0   // do not use cached position
            }
        );
    });
}

// resolve user's address from coordinates using OpenCage Geocoding API
async function getAddressFromCoordinates(lat, lon) {
    // fetch address data from OpenCage API
    try {   // on success
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`);
        const data = await response.json();
        if (response.status === 200 && data.results.length > 0) {   // if response is successful and results exist
            // extract address from response
            const address = data.results[0].components.city || data.results[0].components.county ||
                data.results[0].components.state || data.results[0].components.country;
            return address; // return the resolved address
        } else {    // if response is not successful or no results found
            showToast('map-pin-x', 'Could not resolve address from coordinates.');  // show toast message
            return null;
        }
    } catch (error) {   // on error
        showToast('circle-x', 'Error resolving address from coordinates.'); // show toast message
        return null;
    }
}

// fetch weather data for user's address using visualcrossing weather API
async function fetchWeatherData(address) {
    // fetch weather data from VisualCrossing API
    try {   // on success
        showToast('cloud-download', 'Fetching weather data...');    // show toast message
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${address}?key=${VISUALCROSSING_API_KEY}&unitGroup=metric&elements=datetime,tempmax,tempmin,temp,feelslike,humidity,precipprob,windspeed,pressure,visibility,conditions,icon`);
        const data = await response.json();
        if (response.status === 200) {  // if response is successful
            renderWeatherData(data);    // render weather data
            showToast('circle-check-big', 'Weather fetched successfully!'); // show toast message
        } else if (response.status === 400) {   // if bad request
            showToast('map-pin-x', 'Invalid location! check the spelling.');    // show toast message
        } else {    // for other errors
            showToast('server-off', 'Server error! Try again later.');  // show toast message
        }
    } catch (error) {   // on error
        showToast('circle-x', 'Could not get weather data.');   // show toast message
    }
}

// get user's location and address and fetch weather data
async function getWeatherForCoordinates() {
    // Get coordinates and address, then fetch weather data
    try {   // on success
        const coordinates = await getCoordinates();    // Wait for getCoordinates Promise to resolve
        const [lat, lon] = coordinates; // destructure latitude and longitude
        const address = await getAddressFromCoordinates(lat, lon); // get address from coordinates
        fetchWeatherData(address);  // fetch weather data for the resolved address
    } catch (error) {   // on error
        showToast('circle-x', 'Error has occured!');    // show toast message
    }
}

// on clicking on location button
locationBtn.addEventListener('click', () => {
    if ("geolocation" in navigator) {   // check if geolocation service is supported by the browser
        clearInput(); // clear search box input
        showToast('pin', 'Getting your location...');   // toast message
        getWeatherForCoordinates(); // get user's location and address and fetch weather data
    } else {    // if geolocation service is not supported by the browser (in old browsers)
        alert("Geolocation is not supported by this browser.");
    }
});

// on pressing Enter key in search box => fetch weather data for the entered location
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') { // if Enter key is pressed
        const address = searchInput.value.trim(); // get entered location and trim whitespace
        if (address !== '') { // if address is not empty
            fetchWeatherData(address);  // fetch weather data for the entered location
            searchInput.blur(); // remove focus from search box
        }
    }
});