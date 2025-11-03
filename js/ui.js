// days of the week array
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// mapping icon names from API to icon names in Lucide icons
const icons = {
    'snow': 'snowflake',
    'rain': 'cloud-rain',
    'fog': 'cloud-fog',
    'wind': 'wind',
    'cloudy': 'cloudy',
    'partly-cloudy-day': 'cloud-sun',
    'partly-cloudy-night': 'cloud-moon',
    'clear-day': 'sun',
    'clear-night': 'moon'
}

const themeBtn = document.getElementById('theme-btn');  // theme button
const searchInput = document.getElementById('search-input');  // search box
const xBtn = document.getElementById('x-btn');  // x button

// fetch theme on page load
export function fetchTheme() {
    // if page is loaded for the first time => set theme to light
    if (!localStorage.theme) {
        localStorage.theme = 'light';
    }

    if (localStorage.theme === 'light') {   // if theme preference is light =>
        document.body.classList.remove('dark'); // remove dark styles
        themeBtn.innerHTML = `<i data-lucide="moon"></i>`;  // set theme button to moon icon
    } else {    // if theme preference is dark =>
        document.body.classList.add('dark'); // add dark styles
        themeBtn.innerHTML = `<i data-lucide="sun"></i>`;   // set theme button to sun icon
    }
}

// change page theme on clicking on theme button
export function changeTheme() {
    if (localStorage.theme === 'light') {   // if theme is light =>
        localStorage.theme = 'dark';    // change theme preference
        document.body.classList.add('dark'); // add dark styles
        themeBtn.innerHTML = `<i data-lucide="sun"></i>`;   // set theme button to sun icon
    } else {    // if theme is dark =>
        localStorage.theme = 'light';    // change theme preference
        document.body.classList.remove('dark'); // remove dark styles
        themeBtn.innerHTML = `<i data-lucide="moon"></i>`;  // set theme button to moon icon
    }
    // update icons
    lucide.createIcons();
}

// show or hide x button in search box depending on search box input
export function showHideXBtn() {
    if (searchInput.value === '') { // if no input => hide x button
        xBtn.style.display = 'none';
    } else {    // if input exists => show x button
        xBtn.style.display = 'block';
    }
}

// clear search box input when clicking on x button
export function clearInput() {
    searchInput.value = ''; // clear input
    xBtn.style.display = 'none';    // hide x button
    searchInput.blur(); // remove focus on search box
}

// show toast message
export function showToast(icon, message) {
    // create toast container
    let toast = document.createElement('div');
    toast.id = 'toast';
    let toastBox = document.querySelector('.toastBox');
    toastBox.appendChild(toast);
    // add toast content
    toast.innerHTML = `
        <i data-lucide="${icon}"></i>
        <div class="toast-content">
            ${message}
        </div>
    `;
    // update icons
    lucide.createIcons();
    // hide toast after 5 seconds
    setTimeout(() => {
        toast.classList.add("close");
    }, 4000);
    setTimeout(() => {
        toast.style.display = "none";
    }, 5000);
}

// display weather data for users
export function renderWeatherData(data) {
    let dateObj = new Date();
    let hour = dateObj.getUTCHours() + data.tzoffset;
    let day = dateObj.getUTCDay();
    let currentHourData = data.days[0].hours[hour];

    renderNowSection(data, currentHourData);
    console.log('------------------------------------------------------------------------------------');
    renderHourlySection(data, hour);
    console.log('------------------------------------------------------------------------------------');
    renderSevenDaySection(data, day);
}

// render weather data in now section
function renderNowSection(data, currentHourData) {
    console.log('Address: ', data.resolvedAddress);
    console.log('Time Zone: ', data.timezone);
    console.log('Icon: ', icons[currentHourData.icon]);
    console.log('Temperature: ', Math.round(currentHourData.temp) + '°');
    console.log('Condition: ', currentHourData.conditions);
    console.log('Humidity: ', Math.round(currentHourData.humidity) + '%');
    console.log('Wind Speed: ', currentHourData.windspeed + ' km/h');
    console.log('Pressure: ', currentHourData.pressure + ' mb');
    console.log('Visibility: ', Math.round(currentHourData.visibility) + ' km');
    console.log('Chance of Rain: ', Math.round(currentHourData.precipprob) + '%');
    console.log('Feels Like: ', Math.round(currentHourData.feelslike) + '°');
}

// render weather data in hourly section
function renderHourlySection(data, hour) {
    let dayIndex = 0;

    for (let i = 0; i < 24; i++) {
        if (hour === 0) {
            console.log('12 AM');
        } else if (hour > 0 && hour < 12) {
            console.log(hour + ' AM');
        } else if (hour === 12) {
            console.log('12 PM');
        } else if (hour > 12) {
            console.log(hour - 12 + ' PM');
        }

        if (i === 0) {
            console.log('Now');
        }

        console.log(icons[data.days[dayIndex].hours[hour].icon]);
        console.log(Math.round(data.days[dayIndex].hours[hour].temp) + '°');

        hour++;
        if (hour == 24) {
            dayIndex = 1;
            hour = 0;
        }
    }
}

// render weather data in 7-day section
function renderSevenDaySection(data, day) {
    for (let i = 0; i < 7; i++) {
        console.log(days[day]);

        if (i === 0) {
            console.log('Today');
        }

        day = (day + 1) % 7;

        console.log(icons[data.days[i].icon]);
        console.log(Math.round(data.days[i].tempmax) + '°' + ' / ' + Math.round(data.days[i].tempmin) + '°');
        console.log(data.days[i].conditions);
    }
}