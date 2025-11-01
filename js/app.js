import { fetchTheme, changeTheme, showHideXBtn, clearInput, showToast } from "./ui.js";

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
    if ("geolocation" in navigator) {   // check if geolocation service is supported in the browser
        showToast('map-pin', 'Getting your location.');
        getLocation();
    } else {    // if geolocation service is not supported in the browser (in old browsers)
        alert("Geolocation is not supported in this browser.");
    }
});

async function getLocation() {
    try {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                showToast('check', `Your location is ( ${latitude}, ${longitude} ) !`);
            },
            (err) => {
                showToast('x', 'Could not get your location. Please enable location access and try again.');
            },
            {
                enableHighAccuracy: false, // start low accuracy for faster results
                timeout: 10000,            // wait up to 10s
                maximumAge: 0
            }
        );
    } catch (error) {
        alert("Could not get your location. Please enable location access and try again.");
    }
}