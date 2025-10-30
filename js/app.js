import { fetchTheme, changeTheme } from "./ui.js";

const themeBtn = document.getElementById('theme-btn');  // theme button

// on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchTheme();   // fetch theme from local storage
    lucide.createIcons();   // update icons
});

// on clicking on theme button
themeBtn.addEventListener('click', () => {
    changeTheme();  // change theme
});