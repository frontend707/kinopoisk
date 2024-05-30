

document.getElementById('themeChange').addEventListener ('click', changeTheme)

let loader = document.querySelector('.loader')

let Theme = localStorage.getItem("Theme")
let body = document.querySelector('body')
if (Theme == "dark") {
    body.classList.add("dark")
}
// else {
//     body.classList.add("bg")
// }


function changeTheme(){
    let body = document.querySelector('body')
    body.classList.toggle('dark')
    
    if (body.classList.contains("dark")) {
        localStorage.setItem("Theme","dark")
    } else {
        localStorage.setItem("Theme","bg")
    }

}


async function sendRequest(url, method, data) {
    if (method == "POST") {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    } else if(method == "GET") {
        url = url + "?" + new URLSearchParams(data)
        let response = await fetch(url, {
            method: "GET",
        })
        response = await response.json()
        return response 
    }
}



document.getElementById('serarchBtn').addEventListener('click', findMovie)

async function findMovie() {
    let title = document.getElementById('search').value
    // console.log(title)

    loader.style.display = "block"

    let movie = await sendRequest("https://www.omdbapi.com/", "GET", {
        "apikey": "a5cda678",
        "t": title
    })
    // console.log(movie)
    if (movie.Response == "False") {
        alert(movie.Error)
    } else {
        loader.style.display = "none"
        showMovie(movie)
        findSimilarmovies(title)
        document.getElementById('film').style.display = "block"
    }


}


function showMovie(movie){
    document.querySelector("#film h2").innerHTML = movie.Title
    // console.log(document.querySelector(".movieCover"))
    document.querySelector(".movieCover").style.backgroundImage = `url(${movie.Poster})`

    let array = ["Year", "Released","Runtime", "Genre", "Writer", "Actors", "Language", "Country", "imdbRating", "Type", "totalSeasons"]

    let movieInfos = document.querySelector('.movieInfos')
    movieInfos.innerHTML = ""

    for(let i = 0; i < array.length; i++) {
        let key = array[i]
        let line = `<div class="movieInfo bg-darkest">
            <div class="title">
                ${key}
            </div>
            <div class="value">
                ${movie[key]}
            </div>
        </div>`

        movieInfos.innerHTML = movieInfos.innerHTML + line


    }


}


async function findSimilarmovies(title) {
  
    let similar = await sendRequest("https://www.omdbapi.com/", "GET", {
        "apikey": "a5cda678",
        "s": title
    })
    // console.log(movie)
    if (similar.Response == "False") {
        document.querySelector('#similarFilms h2').innerHTML = `Похожих фильмов 0`
        let similarMovies = document.querySelector('.similarMovies')
        similarMovies.innerHTML = ""
        // alert(smilar.Error)
    } else {
        
        showSimilarMovie(similar.Search)
        document.getElementById('similarFilms').style.display = "block"
    }
}

function showSimilarMovie(movies) {
    let similarMovies = document.querySelector('.similarMovies')
    similarMovies.innerHTML = ""
    j = 0
    for(let i = 0; i < movies.length; i++) {
        let movie = movies[i]
        if (movie.Poster != 'N/A') {
            let movieDiv = document.createElement("div");
            movieDiv.classList.add("similarMovie");
            movieDiv.style.backgroundImage = `url('${movie.Poster}')`;
            movieDiv.innerHTML = `
                    <div class="fav bg-dark"></div>
                    <div class="similarTitile">
                        ${movie.Title}
                    </div> `;
            similarMovies.appendChild(movieDiv);

            let favBtn = movieDiv.querySelector('.fav')
            favBtn.setAttribute('data-poster', movie.Poster)
            favBtn.setAttribute('data-title', movie.Title)
            favBtn.setAttribute('data-imdbID', movie.imdbID)

            let favs = localStorage.getItem('favs');
            if (!favs) {let favs = localStorage.getItem('favs');
            if (!favs) {
                favs = []
            } else {
                favs = JSON.parse(favs)
            }
                favs = []
            } else {
                favs = JSON.parse(favs)
            }

            //nayti etot film v soxrannix LS
            let index = favs.findIndex(e => e.Title === movie.Title);
            //esli film nenaydyon
            if (index > -1) {
                favBtn.classList.add('fav_active')
            }


            favBtn.addEventListener('click', addFavorite)
            
            j++
        }
        

    }
    document.querySelector('#similarFilms h2').innerHTML = `Похожих фильмов ${j}`
}

function addFavorite() {
    let btn = event.target
    let Title = btn.getAttribute('data-title')
    let Poster = btn.getAttribute('data-poster')
    let imdbID = btn.getAttribute('data-imdbID')

    let obj = {Title, Poster, imdbID}

    let favs = localStorage.getItem('favs');
    if (!favs) {
        favs = []
    } else {
        favs = JSON.parse(favs)
    }

    if (btn.classList.contains('fav_active')) {
        //Udalit iz izbrenniy

        //nayti etot film v soxrannix LS
        let index = favs.findIndex(e => e.Title === obj.Title);
        if (index > -1) {
            favs.splice(index, 1);
            localStorage.setItem('favs',  JSON.stringify(favs))
            btn.classList.remove('fav_active')
        }


        
    } else {
        //Dobavit v izbrenniy



        //nayti etot film v soxrannix LS
        let index = favs.findIndex(e => e.Title === obj.Title);
        //esli film nenaydyon
        if (index == -1) {
            favs.push(obj);
            localStorage.setItem('favs',  JSON.stringify(favs))
            btn.classList.add('fav_active')
        }
        


    }

    // console.log(btn)    
    // console.log(obj)

            
}


function showFavorites() {
    let favs = localStorage.getItem('favs');
    if (!favs) {
        favs = []
    } else {
        favs = JSON.parse(favs)
    }

    let similarMovies = document.querySelector('.similarMovies')
    similarMovies.innerHTML = ""
    
    for(let i = 0; i < favs.length; i++) {
        let movie = favs[i]
        if (movie.Poster != 'N/A') {
            let movieDiv = document.createElement("div");
            movieDiv.classList.add("similarMovie");
            movieDiv.style.backgroundImage = `url('${movie.Poster}')`;
            movieDiv.innerHTML = `
                    <div class="fav bg-dark"></div>
                    <div class="similarTitile">
                        ${movie.Title}
                    </div> `;
            similarMovies.appendChild(movieDiv);

            let favBtn = movieDiv.querySelector('.fav')
            favBtn.setAttribute('data-poster', movie.Poster)
            favBtn.setAttribute('data-title', movie.Title)
            favBtn.setAttribute('data-imdbID', movie.imdbID)    
            
            favBtn.classList.add('fav_active')
           
            favBtn.addEventListener('click', addFavorite)
        }
        

    }
    document.querySelector('#similarFilms h2').innerHTML = `Выьренных фильмов ${favs.length}`
}   

