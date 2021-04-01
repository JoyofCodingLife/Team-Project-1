// Define main variables
let searchButtonEl = document.querySelector(".searchBtn");
let searchInputEl = document.querySelector(".search");

// Function to call when the document loads (opacity)
window.onload = function() {
    document.body.setAttribute("class", "content-loaded")
}

// Favourites bar on the left/right of page has localStorage favourites - rename favourites to SHIELD related
// localStorage to store user's favourite heroes (will shorten loading screen since data is saved locally)

// Search function
function heroLocator() {

    let heroName = searchInputEl.value();

};

// Search input

// function to get API
function getMarvelAPI() {

};

// Autocomplete widget for search bar

// need a function to renderHeroResults (this will have us dynamically changing HTML and CSS)
function renderHeroResults() {

};

// Search button event listener
searchButtonEl.addEventListener("click", heroLocator);

