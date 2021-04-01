// List of API keys
// // Marvel API key - 2abb8d4dbef38b7b61728089ea5eb10e
let marvelAPIKey = "2abb8d4dbef38b7b61728089ea5eb10e";

// Define main variables
let searchButtonEl = document.querySelector(".searchBtn");
let searchInputEl = document.querySelector(".search");

// Function to call when the document loads (opacity)
window.onload = function() {
    document.body.setAttribute("class", "content-loaded")
}

// Favourites bar on the left/right of page has localStorage favourites - rename favourites to SHIELD related
// localStorage to store user's favourite heroes (will shorten loading screen since data is saved locally)


// Function to clean up search function parameters
function cleanSearchParams() {

    // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
    let herosearchParamsArr = document.location.search.split('&');
  
    // Get the query and format values
    let query = herosearchParamsArr[0].split('=').pop();

    getMarvelAPI(query);
};

// Search function
function heroLocator(event) {

    // Prevents page from auto-refreshing
    event.preventDefault();

    // Variables needed for search function
    let heroName = searchInputEl.value();

    // If no hero name, return error
    if (!heroName) {
        // console.error is a placeholder for now. Have something more dynamic that alerts user to enter again.
        console.error("Hero not found. Probably undercover at HYDRA, please try again.");
        return;
    }

};

// Search input

// Autocomplete widget for search bar

// function to get API
function getMarvelAPI() {

    let requestMarvelUrl = "developer.marvel.com";

    //  "http://gateway.marvel.com/v1/public/comics?ts=1&apikey=1234&hash=ffd275c5130566a2916217b101f26150"

    // API key 2abb8d4dbef38b7b61728089ea5eb10e



};

// need a function to renderHeroResults (this will have us dynamically changing HTML and CSS)
function renderHeroResults() {

};

// Search button event listener
searchButtonEl.addEventListener("click", heroLocator);

