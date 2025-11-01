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
    // hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.add("close");
    }, 3000);
    setTimeout(() => {
        toast.style.display = "none";
    }, 4000);
}