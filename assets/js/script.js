// List of API keys
    // Spare YouTube API key if reached limit - AIzaSyBRxfRMSHXHVjrG4_ucs9Sf1tAr2bZ4slQ
const marvelPublicAPIKey = "2abb8d4dbef38b7b61728089ea5eb10e";
const youTubeAPIKey = "AIzaSyDWRsGKQ_E_9GKNMkPoVPj2Pi0P10AJ_Vc";
// const marvelChannelID = "UCvC4D8onUfXzvjTOM-dBfEA";

// Define main variables
let searchButtonEl = document.querySelector(".searchBtn");
let searchInputEl = document.querySelector(".search");
let engageSearchEl = document.querySelector("#engageSearchProtocol");
let heroSearchForm = document.querySelector("#heroSearchForm");
let engageSearchBtn = document.querySelector("#engageBtn");

let mostWantedEl = document.querySelector("#most-wanted");

// let heroCardContainer = document.querySelector("#heroLocatorResults");    
let heroCardContainer = document.querySelector("#heroCardContainer");
let comicCardContainer = document.querySelector("#comicsCardContainer");

let errorMessageEl = document.querySelector("#error-message");
let hydraLogoEl = document.querySelector("#hydra-logo");
let warningMessageEl = document.querySelector("#warning-message");
let wrongHeroEl = document.querySelector("#wrong-hero");

let navBarEl = document.querySelector(".navbar");
let homeEl = document.querySelector("#homeSection");
let locatorEl = document.querySelector("#locatorSection");
let cardResultEl = document.querySelector("#cardSection");
let videoResultEl = document.querySelector("#videoSection");
let galleryEl = document.querySelector("#gallerySection");
let aboutUsEl = document.querySelector("#aboutUsSection");
let footerEl = document.querySelector("#footer");

// Storage
// localStorage to store user's recently search heroes (will shorten loading screen since data is saved locally)
let searchHistoryHeroList = [];
let STORAGE_SEARCH_HISTORY_KEY = "search-history-hero";
let storedSearchHistory = localStorage.getItem(STORAGE_SEARCH_HISTORY_KEY);
    if (storedSearchHistory !==null) {
    searchHistoryHeroList = JSON.parse(storedSearchHistory);
}

// Function to call when the document loads (opacity)
window.onload = function () {
    document.body.setAttribute("class", "content-loaded")
};

// Engage function (to display search bar)
function engageSearch() {

    engageSearchEl.style.display = "none";
    heroSearchForm.style.display = "flex";
    mostWantedEl.style.display = "block";
}

// Engage button event listener
engageSearchBtn.addEventListener("click", engageSearch);

// Search function
function heroLocator(heroName) {

    // Storage
    if (searchHistoryHeroList.indexOf(heroName) === -1) {
        searchHistoryHeroList.unshift(heroName);
        searchHistoryHeroList.splice(6);
    }
    
    displaySearchHistoryHeroList();

    localStorage.setItem(STORAGE_SEARCH_HISTORY_KEY, JSON.stringify(searchHistoryHeroList));
        
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
           let heroID = data.results[0].id;
           showHeroCards(data);

           let comicBookUrl = buildApiUrl(`characters/${heroID}/comics`);
           return fetchJsonData(comicBookUrl).then(function(jsonData) {
               displayComicData(jsonData.data);
            });
        }
    }).catch(function(err) {
        console.log(err);
        console.log("Failed to get hero data!");
    });


    searchVideos(heroName);
};


function displayComicData(comics) {

    console.log(comics);

    comics.results.forEach((comic) => {
        // let result = comic.results[0];
        // console.log(result);
        console.log(comic);
        let comicTitle = comic.title;
        let comicThumbnailUrl = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
        let comicCreator = comic.creators.items[0].name;
        let comicInfo = comic.urls[0].url;
    
        const comicCard = `
        <div id="comicsCard" class="comics-card"> 
            <div class="comic-profile-layout">
                <div class="comicDP">
                    <img src=${comicThumbnailUrl} alt="This is an image of ${comicTitle}" />
                </div>
                <div class="comicDetails">
                    <p class="comicTitle">${comicTitle}</p>
                    <p><a href="${comicInfo}" target="_blank">Official Comic Info</a></p>
                </div>
            </div>
        </div>
        `;
         comicCardContainer.innerHTML += comicCard;
    });
};

// Separate function to show hero cards
function showHeroCards(hero) {

    let result = hero.results[0];
    let thumbnailUrl = `${result.thumbnail.path}.${result.thumbnail.extension}`;
    let officialUrls = result.urls;
    let officialComicLink = officialUrls[2];
    let officialWiki = officialUrls[1];
    let heroImage = thumbnailUrl;
    let heroName = result.name;
    let heroID = result.id;
    let heroComicLink = officialComicLink.url;
    let heroWiki = officialWiki.url;

    // construct hero card layout

    const heroCard = `
        <div id="heroCard" class="id-card"> 
            <div class="profile-row">
                <div class="heroCardDP">
                    <div class="dp-arc-outer"></div>
                    <div class="dp-arc-inner"></div>
                    <img class="heroImage" src=${heroImage} alt="This is an image of ${heroName}" />
                </div>
                <div class="heroCardDesc">
                    <div class="heroDetails">
                        <p class="heroName">${heroName}</p>
                        <p class="file-id">ID#${heroID}</p>
                        <p><a href="${heroWiki}" target="_blank">Official Hero Wiki</a></p>
                        <p><a href="${heroComicLink}" target="_blank">Official Comic Appearances</a></p>
                    </div>
                </div>
            </div>
        </div>
        `;

    // append herocard to container
    heroCardContainer.innerHTML += heroCard;
};

// Function to clear contents of hero card
function clearHeroCards() {
    heroCardContainer.innerHTML = "";
    comicsCardContainer.innerHTML = "";
};

function searchVideos(heroName) {

    // YOUTUBE API section ----------------------------------------------
    //GET https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCvC4D8onUfXzvjTOM
    //"part": ["snippet"],
    //"channelId": "UCvC4D8onUfXzvjTOM-dBfEA", -> Marvel Entertainment Channel
    //"maxResults": 10,
    //"order": "videoCount",
    //"q": "surfing" -> what we are looking for?

    let youtube2APIURL =  `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCvC4D8onUfXzvjTOM-dBfEA&maxResults=10&order=videoCount&q=${heroName}&key=${youTubeAPIKey}`;
    $.ajax ({
        url: youtube2APIURL,
        method: "GET",
    }). then (function(youtubeResponse) {
        $(videoResultEl).empty();
        let validCount = 0;
        for (let i = 0; i < youtubeResponse.items.length && validCount < 5; i++ ) {
            let videoInfo = {
                title: youtubeResponse.items[i].snippet.title,
                description: youtubeResponse.items[i].snippet.description,
                video: youtubeResponse.items[i].id.videoId,
            };
            // Not all responses have a videoId for some reason.
            if (videoInfo.video === undefined) {
                continue;
            }
            validCount++;
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

// Search input

// Autocomplete widget for search bar
function fetchJsonData(url) {
    return fetch(url).then(function(response) {
        if (response.ok) {
            return response.json()
        }
        return Promise.reject(response);
    });
}

function buildApiUrl(apiPath) {
    return `https://gateway.marvel.com/v1/public/${apiPath}?apikey=${marvelPublicAPIKey}`;
};

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
};

function displaySearchHistoryHeroList() {

    let searchHistoryHeroContainer = $("#search-history-hero");
    $("#search-history-title").html("Your Most Wanted Heroes");
    searchHistoryHeroContainer.find("button").remove();
    searchHistoryHeroList.forEach(function (heroName) {
        let searchHistoryHeroButton = $("<button></button>");
        searchHistoryHeroButton.addClass("column");
        searchHistoryHeroButton.append(heroName);
        searchHistoryHeroButton.appendTo(searchHistoryHeroContainer);
        searchHistoryHeroButton.click(function () {
            heroLocator(heroName);
            // searchInputEl.scrollIntoView(true);
            $('html,body').animate({
                    scrollTop: $(".search").offset().top},
                'slow');
        });
    });
};

// Search button event listener

searchButtonEl.addEventListener("click", function (event) {
    clearHeroCards();
    heroLocator(searchInputEl.value);

});

searchInputEl.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        searchButtonEl.click();
    }

});

$(searchInputEl).autocomplete({source: HeroList});
displaySearchHistoryHeroList();

// Navigation 
document.querySelector("#galleryLink").onclick = function () {
    navBarEl.style.display = "block";
    homeEl.style.display = "none";
    locatorEl.style.display = "none";
    cardResultEl.style.display = "none";
    videoResultEl.style.display = "none";
    galleryEl.style.display = "block";
    aboutUsEl.style.display = "none";
    footerEl.style.display = "none";
};

document.querySelector("#aboutUsLink").onclick = function () {
    navBarEl.style.display = "block";
    homeEl.style.display = "none";
    locatorEl.style.display = "none";
    cardResultEl.style.display = "none";
    videoResultEl.style.display = "none";
    galleryEl.style.display = "none";
    aboutUsEl.style.display = "block";
    footerEl.style.display = "none";
};

document.querySelector("#homeLink").onclick = function () {
    navBarEl.style.display = "block";
    homeEl.style.display = "flex";
    locatorEl.style.display = "block";
    cardResultEl.style.display = "block";
    videoResultEl.style.display = "grid";
    galleryEl.style.display = "none";
    aboutUsEl.style.display = "none";
    footerEl.style.display = "block";
};

document.querySelector("#locatorLink").onclick = function () {
    navBarEl.style.display = "block";
    homeEl.style.display = "flex";
    locatorEl.style.display = "block";
    cardResultEl.style.display = "block";
    videoResultEl.style.display = "grid";
    galleryEl.style.display = "none";
    aboutUsEl.style.display = "none";
    footerEl.style.display = "none";
};