import { fetchTheme, changeTheme, showHideXBtn, clearInput } from "./ui.js";

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
locationBtn.addEventListener('click', (event) => {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
            console.error("Error getting location:", error.message);
        }
    );
});