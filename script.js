let apikey = "";
var tabFavorites = [];

async function loadEnv() {
    const response = await fetch("./env.json");
    const jsonData = await response.json();
    apikey = jsonData.apikey;
}

function searchMovie() {
    let url = apikey + "&s=" + document.querySelector("#searchBar").value;
    fetch(url)
        .then((response) => response.json()) // retourn au 2em then le body = contenu JSON
        .then((data) => {
            let tab = data.Search;
            clearDiv("#divDisplayFilm");
            for (let film of tab) {
                if (film.Type == "movie") {
                    displayFilm(film);
                }
            }
        });
}

async function getSpecificMoviePlot(movieName) {
    let url = apikey + "&t=" + movieName;
    const response = await fetch(url);
    const movie = await response.json();
    return movie.Plot;
}

async function displayFilm(film) {
    let newDisplayFilm = document.importNode(
        document.querySelector("#templateDisplayFilm").content,
        true
    );
    newDisplayFilm.querySelector("#movieName").innerHTML = film.Title;
    newDisplayFilm.querySelector("#moviePoster").setAttribute("src", film.Poster);
    newDisplayFilm.querySelector("#movieDescription").innerHTML = await getSpecificMoviePlot(film.Title);
    document.querySelector("#divDisplayFilm").appendChild(newDisplayFilm);
}

function clearDiv(div) {
    let selector = document.querySelector(div);
    while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
    }
}

function addMovieToFav(e) {
    let movieName =
        e.parentElement.parentElement.querySelector("#movieName").innerHTML;
    let url = apikey + "&t=" + movieName;
    fetch(url)
        .then((response) => response.json())
        .then((film) => {
            // Push the object in tabFavorites
            tabFavorites.push(film);
            // Store the table in localStorage
            localStorage.setItem("tabFavorites", JSON.stringify(tabFavorites));
            // Display favorites in HTML
            displayMovieFromLocalStorageToFav();
        });
}

function removeMovieFromFav(e) {
    let idx = e.parentElement.parentElement
        .querySelector("#movieName")
        .getAttribute("data-id");
    // Remove movie with index
    tabFavorites.splice(idx, 1);
    // Store the table in localStorage
    localStorage.setItem("tabFavorites", JSON.stringify(tabFavorites));
    // Display favorites in HTML
    displayMovieFromLocalStorageToFav();
}

function displayMovieFromLocalStorageToFav() {
    // Update JS table from localStorage
    if (localStorage.getItem("tabFavorites") != null) {
        let idx = 0;
        tabFavorites = JSON.parse(localStorage.getItem("tabFavorites"));
        // Clear favorites div
        clearDiv("#divFavorites");
        // Add to HTML
        for (let fav of tabFavorites) {
            let newFavorite = document.importNode(
                document.querySelector("#templateFavorites").content,
                true
            );
            newFavorite.querySelector("#movieName").innerHTML = fav.Title;
            newFavorite.querySelector("#movieName").setAttribute("data-id", idx++);
            document.querySelector("#divFavorites").appendChild(newFavorite);
        }
    }
}
// ------------ MAIN --------------------- //
loadEnv();
displayMovieFromLocalStorageToFav();