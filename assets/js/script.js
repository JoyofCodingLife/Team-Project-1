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
// let heroCardContainer = document.querySelector("#heroLocatorResults");    
let heroCardContainer = document.querySelector("#heroCardContainer");
let comicCardContainer = document.querySelector("#comicCardContainer");


let errorMessageEl = document.querySelector("#error-message")
let hydraLogoEl = document.querySelector("#hydra-logo")
let warningMessageEl = document.querySelector("#warning-message")
let wrongHeroEl = document.querySelector("#wrong-hero");

let videoResultEl = $("#videoResults");


// Function to call when the document loads (opacity)
window.onload = function () {
    document.body.setAttribute("class", "content-loaded")
};

// Favourites bar on the left/right of page has localStorage favourites - rename favourites to SHIELD related
// localStorage to store user's favourite heroes (will shorten loading screen since data is saved locally)

// Function to clean up search function parameters
// function cleanSearchParams() {

//     // Get the search params out of the URL (i.e. `?q=london&format=photo`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
//     let heroSearchParamsArr = document.location.search.split('&');

//     // Get the query and format values
//     let query = herosearchParamsArr[0].split('=').pop();

//     getMarvelAPI(query);
// };

// Engage function (to display search bar)
function engageSearch() {

    engageSearchEl.style.display = "none";
    heroSearchForm.style.display = "flex";
};

// Engage button event listener
engageSearchBtn.addEventListener("click", engageSearch);

// Search function
function heroLocator(event) {

    event.preventDefault();

    // Variables needed for search function
    let heroName = searchInputEl.value;

    // If no hero name, return error
    if (!heroName) {
        // console.error is a placeholder for now. Have something more dynamic that alerts user to enter again.
        console.error("Hero not found. Probably undercover at HYDRA, please try again later.");

        console.error("Hero not found. Probably undercover at HYDRA, please try again.");

        return;
    }

    // See https://developer.marvel.com/docs#!/public/getCreatorCollection_get_0
    fetchJsonData(buildApiUrl("characters") + `&name=${heroName}`).then(function(jsonData) {


        // Main variables from Marvel API - v1/public/characters
        let data = jsonData.data;

       if (data.total === 0) {
           errorMessageEl.innerHTML = "Hero not found. Probably undercover at HYDRA, please try again.";
           hydraLogoEl.setAttribute("src", "assets/images/hydra_logo.png");
           warningMessageEl.innerHTML = "Warning:";
           console.error("No heroes found!");
       } else {
           // Always use the first result
           wrongHeroEl.style.display = "none";
           let result = data.results[0];
           let thumbnailUrl = `${result.thumbnail.path}.${result.thumbnail.extension}`;
        };

        if (data.total !== 0) {

            let heroID = data.results[0].id;
            console.log(heroID);
            const comicBookAPIUrl = `https://gateway.marvel.com/v1/public/characters/${heroID}/comics?apikey=${marvelPublicAPIKey}`;
            showHeroCards(data);

            fetch(comicBookAPIUrl)            
            .then(function (response) {
                if (response.error) {
                    throw new Error("Unable to obtain comic book data"); 
                } 
                
                return response.json();
        
            }).then(function (data) {

                displayComicData(data);
                
            }).catch(error => {
                console.log("error: ", error)
            });
            // Un-comment this once get hero comic data is working:
            // getHeroComicData(data);
        } else {
            return console.error("No heroes found!")};
    }).catch(function(err) {
        console.log(err);
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
    searchVideos();
}

// Function to get comic data
// function getHeroComicData(data) {

//     // Example API Url:
//     // https://gateway.marvel.com:443/v1/public/characters/1009368/comics?apikey=31b9bc16e5d84eea2502c7adf4fceced

//     // GET /v1/public/characters/{characterId}/comics
//     fetch(comicBookAPIUrl)            
//     .then(function (response) {
//         if (response.error) {
//             throw new Error("Unable to obtain comic book data"); 
//         } 
//         return response.json();
        
//     }).then(function (data) {
//         displayComicData(data);
//     }).catch(error => {
//         console.log("error: ", error)
//     });
// };

function displayComicData(data) {

    let result = data.results[0];
    console.log(result);
    let comicTitle = result.title;
    let comicThumbnailUrl = `${result.thumbnail.path}.${result.thumbnail.extension}`;
    let comicCreator = result.creator.item.name;
    let comicDescription = result.description;
    
    const comicCard = `
    <div id="comicCard"> 
    <div id="comicCardTitle">
    <h3>Hero File Found: ${comicTitle}</h3>
    </div>
    <div class="heroImg">
    <img src=${comicThumbnailUrl} alt="This is an image of ${comicTitle}" />
    </div>
    <div class="comicDetails">
    <h4>${comicTitle}</h4>
    <h6>This comic was created by: ${comicCreator}.</h6>
    <p>${comicDescription}</p>
    </div>
    </div>
    `;
    
    // append herocard to container
    comicCardContainer.innerHTML += comicCard;
};

// Separate function to show hero cards
function showHeroCards(hero) {

    let result = hero.results[0];
    let thumbnailUrl = `${result.thumbnail.path}.${result.thumbnail.extension}`;
    let officialUrls = result.urls;
    let officialDetail = officialUrls[0];
    let officialWiki = officialUrls[1];
    let heroImage = thumbnailUrl;
    let heroName = result.name;
    let heroBio = result.description;
    let heroDetail = officialDetail.url;
    let heroWiki = officialWiki.url;

    // construct hero card layout

    const heroCard = `
        <div id="heroCard"> 
        <div id="heroCardTitle">
        <h3>Hero File Found: ${heroName}</h3>
        </div>
        <div class="heroImg">
        <img src=${heroImage} alt="This is an image of ${heroName}" />
        </div>
        <div class="heroDetails">
        <h4>${heroName}</h4>
        <h6>${heroBio}</h6>
        <p>View official hero detail <a href="${heroDetail}">here</a>.</p>
        <p>View official hero wiki <a href="${heroWiki}">here</a>.</p>
        </div>
        </div>
        `;

    // append herocard to container
    heroCardContainer.innerHTML += heroCard;

};

// Function to clear contents of hero card
function clearHeroCards() {
    heroCardContainer.innerHTML = "";
    // comicCardContainer.innerHTML = "";
};

// Search input

// Autocomplete widget for search bar
function fetchJsonData(url) {
    return fetch(url).then(function(response) {
        if (response.ok) {
            return response.json()};
        return Promise.reject(response);
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
searchButtonEl.addEventListener("click", function(event){
    clearHeroCards();
    heroLocator(event);
});

$(searchInputEl).autocomplete({source: HeroList});


