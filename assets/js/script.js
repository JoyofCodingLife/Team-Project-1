// List of API keys
// // Marvel API key - 2abb8d4dbef38b7b61728089ea5eb10e
const marvelPublicAPIKey = "2abb8d4dbef38b7b61728089ea5eb10e";
const youTubeAPIKey = "AIzaSyBRxfRMSHXHVjrG4_ucs9Sf1tAr2bZ4slQ";
const marvelChannelID = "UCvC4D8onUfXzvjTOM-dBfEA";

// Define main variables
let searchButtonEl = document.querySelector(".searchBtn");
let searchInputEl = document.querySelector(".search");
let engageSearchEl = document.querySelector("#engageSearchProtocol");
let heroSearchForm = document.querySelector("#heroSearchForm");
let engageSearchBtn = document.querySelector("#engageBtn");

let errorMessageEl = document.querySelector("#error-message")
let hydraLogoEl = document.querySelector("#hydra-logo")
let warningMessageEl = document.querySelector("#warning-message")
let wrongHeroEl = document.querySelector("#wrong-hero");

let videoResultEl = $("#videoResults");


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

// Engage function (to display search bar)
function engageSearch() {

    engageSearchEl.style.display = "none";
    heroSearchForm.style.display = "flex";
};

// Engage button event listener
engageSearchBtn.addEventListener("click", engageSearch);

// Search function
function heroLocator(event) {

    // Prevents page from auto-refreshing
    event.preventDefault();

    // Variables needed for search function
    let heroName = searchInputEl.value;

    // If no hero name, return error
    if (!heroName) {
        // console.error is a placeholder for now. Have something more dynamic that alerts user to enter again.
        console.error("Hero not found. Probably undercover at HYDRA, please try again.");

        return;
    }



    // See https://developer.marvel.com/docs#!/public/getCreatorCollection_get_0
    fetchJsonData(buildApiUrl("characters") + `&name=${heroName}`).then(function(jsonData) {
       let data = jsonData.data;

       if (data.total === 0) {
           wrongHeroEl.style.display = "inline-block";
           errorMessageEl.innerHTML = "Hero not found. Probably undercover at HYDRA, please try again later.";
           hydraLogoEl.setAttribute("src", "assets/images/hydra_logo.png");
           warningMessageEl.innerHTML = "Warning:";
           console.error("No heroes found!");
       } else {
           // Always use the first result
           wrongHeroEl.style.display = "none";
           let result = data.results[0];
           let thumbnailUrl = `${result.thumbnail.path}.${result.thumbnail.extension}`;

           console.log(result.name);
           console.log(result.description);
           console.log(thumbnailUrl);

       }
    }).catch(function(err) {
        console.log("Failed to get hero data!");
    });

    function searchVideos() {

        // YOUTUBE API section ----------------------------------------------
        //GET https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCvC4D8onUfXzvjTOM
        //"part": ["snippet"],
        //"channelId": "UCvC4D8onUfXzvjTOM-dBfEA", -> Marvel Entertainment Channel
        //"maxResults": 25,
        //"order": "videoCount",
        //"q": "surfing" -> what we are looking for?

        let youtube2APIURL =  `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCvC4D8onUfXzvjTOM-dBfEA&maxResults=25&order=videoCount&q=${heroName}&key=${youTubeAPIKey}`;
        $.ajax ({
            url: youtube2APIURL,
            method: "GET",
        }). then (function(youtubeResponse) {
            $(videoResultEl).empty();
            for (let i = 0; i < 5; i++ ) {
                let videoInfo = {
                    title: youtubeResponse.items[i].snippet.title,
                    description: youtubeResponse.items[i].snippet.description,
                    video: youtubeResponse.items[i].id.videoId,
                };
                let videoCard = $(`
                <div class="video-item">
                    <div class="video-wrap">
                     <iframe src="https://www.youtube.com/embed/${videoInfo.video}" title="iframe VideoBox" width="640" height="360" allowfullscreen></iframe>
                     <h3>${videoInfo.title}</h3>
                     <p>${videoInfo.description}</p>
                    </div>
                </div>
                `);
                $(videoResultEl).append(videoCard);
            }
        });
    }
    searchVideos ();
    
    

}

// Search input

// Autocomplete widget for search bar
function fetchJsonData(url) {
    return fetch(url).then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    });


}

function buildApiUrl(apiPath) {
    return `https://gateway.marvel.com/v1/public/${apiPath}?apikey=${marvelPublicAPIKey}`;
}

/**
 * Repeatedly request heroes from the API to build a list of all heroes. We don't call this as part of the actual
 * website's usage. Instead, we call it once to build a list of heroes that we can then use for autocomplete during
 * search without having to constantly make new requests.
 *
 * See heroes.js for the list.
 */
function buildHeroList() {

    // We can't get more than 100 results per request and the default is 20. We use the maximum to reduce number of
    // requests.
    let characterApiUrl = buildApiUrl("characters") + "&limit=100";
    let allHeroList = [];

    // This function handles the response for one request of up to 100 results.
    let handleResponse = function(jsonData) {
        let data = jsonData.data;

        // Add each hero name into our list.
        data.results.forEach(function(result) {
            allHeroList.push(result.name);
        });

        // If we need to get more data, then we make another request and return that promise, and pass this function
        // back as the handler so it runs like a loop.
        let currentCount = allHeroList.length;
        if (currentCount < data.total) {
            return fetchJsonData(characterApiUrl + `&offset=${currentCount}`).then(handleResponse);
        }
    };

    // Start requesting chunks of data
    fetchJsonData(characterApiUrl).then(handleResponse).then(function() {
        console.log(`Got list of ${allHeroList.length} heroes, copy following line into heroes.js to update the list`);
        console.log(JSON.stringify(allHeroList));
    }).catch(function(err) {
        console.log("Failed to build hero list: " + err);
    });
}

// need a function to renderHeroResults (this will have us dynamically changing HTML and CSS)
function renderHeroResults() {

}

// YOUTUBE API section ----------------------------------------------
     //GET https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCvC4D8onUfXzvjTOM-dBfEA&maxResults=25&order=videoCount&q=surfing&key=AIzaSyBRxfRMSHXHVjrG4_ucs9Sf1tAr2bZ4slQ
     //"part": ["snippet"],
     //"channelId": "UCvC4D8onUfXzvjTOM-dBfEA", -> Marvel Entertainment Channel
     //"maxResults": 25,
     //"order": "videoCount",
     //"q": "surfing" -> what we are looking for?
 
// EVENT LISTENERS section ----------------------------------------------
// Search button event listener
searchButtonEl.addEventListener("click", heroLocator);
searchInputEl.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        searchButtonEl.click();
    }
});

$(searchInputEl).autocomplete({source: HeroList});


