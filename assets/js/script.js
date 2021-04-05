// List of API keys
// // Marvel API key - 2abb8d4dbef38b7b61728089ea5eb10e
const marvelPublicAPIKey = "2abb8d4dbef38b7b61728089ea5eb10e";

// Define main variables
let searchButtonEl = document.querySelector(".searchBtn");
let searchInputEl = document.querySelector(".search");

// Function to call when the document loads (opacity)
window.onload = function () {
    document.body.setAttribute("class", "content-loaded")
}

// Favourites bar on the left/right of page has localStorage favourites - rename favourites to SHIELD related
// localStorage to store user's favourite heroes (will shorten loading screen since data is saved locally)


// Function to clean up search function parameters
function cleanSearchParams() {

    // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
    let heroSearchParamsArr = document.location.search.split('&');

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

function testMarvelAPI() {

    let requestMarvelUrl = "http://gateway.marvel.com/v1/public/comics?apikey=" + marvelPublicAPIKey;
    fetch(requestMarvelUrl).then(function(response) {
        // Decode the response body if it was successful
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject("Marvel API rejected request");
        }
    }).then(function(data) {
        // This is the data we actually care about.
        console.log(data);
    }).catch(function(err) {
        console.log(err);

    });

}

// need a function to renderHeroResults (this will have us dynamically changing HTML and CSS)
function renderHeroResults() {

}

// Search button event listener
searchButtonEl.addEventListener("click", heroLocator);

testMarvelAPI();