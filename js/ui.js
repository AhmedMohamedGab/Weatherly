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

    lucide.createIcons();   // update icons
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

    lucide.createIcons();   // update icons

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
    let hour = dateObj.getHours();
    let day = dateObj.getDay();
    let currentHourData = data.days[0].hours[hour];

    renderNowSection(data, currentHourData);
    renderHourlySection(data, hour);
    renderSevenDaySection(data, day);

    lucide.createIcons();   // update icons
}

// render weather data in now section
function renderNowSection(data, currentHourData) {
    document.getElementById('address').innerHTML = data.resolvedAddress;
    document.getElementById('time-zone').innerHTML = data.timezone;
    document.querySelector('#now-icon').innerHTML = `<i data-lucide="${icons[currentHourData.icon]}"></i>`;
    document.getElementById('temp-now').innerHTML = Math.round(currentHourData.temp) + '°';
    document.getElementById('condition').innerHTML = currentHourData.conditions;
    document.getElementById('humidity').innerHTML = Math.round(currentHourData.humidity) + '%';
    document.getElementById('wind-speed').innerHTML = currentHourData.windspeed + ' km/h';
    document.getElementById('pressure').innerHTML = currentHourData.pressure + ' mb';
    document.getElementById('visibility').innerHTML = Math.round(currentHourData.visibility) + ' km';
    document.getElementById('chance-of-rain').innerHTML = Math.round(currentHourData.precipprob) + '%';
    document.getElementById('feels-like').innerHTML = Math.round(currentHourData.feelslike) + '°';
}

// render weather data in hourly section
function renderHourlySection(data, hour) {
    let dayIndex = 0;
    let hourHolder = '';
    let iconHolder = '';
    let tempHolder = '';

    document.querySelectorAll('.hour-div').forEach((div, index) => {
        if (hour === 0) {
            hourHolder = '12 AM';
        } else if (hour > 0 && hour < 12) {
            hourHolder = hour + ' AM';
        } else if (hour === 12) {
            hourHolder = '12 PM';
        } else if (hour > 12) {
            hourHolder = hour - 12 + ' PM';
        }

        if (index === 0) {
            hourHolder = 'Now';
        }

        iconHolder = icons[data.days[dayIndex].hours[hour].icon];
        tempHolder = Math.round(data.days[dayIndex].hours[hour].temp) + '°';

        div.innerHTML = `
            <p class="hour">${hourHolder}</p>
            <i data-lucide="${iconHolder}"></i>
            <p class="temp-hour">${tempHolder}</p>
        `;

        hour++;
        if (hour == 24) {
            dayIndex = 1;
            hour = 0;
        }
    });
}

// render weather data in 7-day section
function renderSevenDaySection(data, day) {
    let dayHolder = '';
    let iconHolder = '';
    let tempHolder = '';
    let conditionHolder = '';

    document.querySelectorAll('.day-div').forEach((div, index) => {
        dayHolder = days[day];
        if (index === 0) {
            dayHolder = 'Today';
        }
        iconHolder = icons[data.days[index].icon];
        tempHolder = Math.round(data.days[index].tempmax) + '°' + ' / ' + Math.round(data.days[index].tempmin) + '°';
        conditionHolder = data.days[index].conditions;

        div.innerHTML = `
            <p class="day">${dayHolder}</p>
            <i data-lucide="${iconHolder}"></i>
            <p class="temp-day">${tempHolder}</p>
            <p class="condition-day">${conditionHolder}</p>
        `;

        day = (day + 1) % 7;
    });
}