export let searchHistory = []; // array to hold search history items

// get search history from local storage
export function getSearchHistory() {
    searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
}

// add a new item to search history
export function addHistoryItem(address) {
    // if address already exists in history => remove it
    if (searchHistory.includes(address)) {
        searchHistory = searchHistory.filter(item => item !== address);
    }

    searchHistory.unshift(address); // add new address to the beginning of the history array

    if (searchHistory.length > 5) { // keep only last 5 items in history
        searchHistory.pop();
    }

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory)); // update local storage
}