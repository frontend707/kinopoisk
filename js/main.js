

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
                    <div class="fav bg-dark">
                        <img src="./img/favBtn.svg" alt="favorites">
                    </div>
                    <div class="similarTitile">
                        ${movie.Title}
                    </div> `;
            similarMovies.appendChild(movieDiv);
            addFavorites(movieDiv, movie)
            



            // let movieDiv = `    
            // <div class="similarMovie" style="background-image: url('${movie.Poster}');">
            //             <div class="fav bg-dark">
            //                 <img src="./img/favBtn.svg" alt="favorites">
            //             </div>
            //             <div class="similarTitile">
            //                 ${movie.Title}
            //             </div>
            //         </div>
            // `
            // similarMovies.innerHTML = similarMovies.innerHTML + movieDiv
            j++
        }
        

    }
    document.querySelector('#similarFilms h2').innerHTML = `Похожих фильмов ${j}`
}

function addFavorites(movieDiv, movie) {
    let favBtn = movieDiv.querySelector(".fav")
    favBtn.addEventListener("click", favorites)

    function favorites() {
        favBtn.classList.toggle("fava_ctive")
        


    }

            
}

// function discountPrices (prices, discount) {
//     var discounted = []
//     for (var i = 0; i < prices.length; i++) {
//       var discountedPrice = prices[i] * (1 - discount)
//       var finalPrice = Math.round(discountedPrice * 100) / 100
//       discounted.push(finalPrice)
//     }console.log(i) // 3
//     console.log(discountedPrice) // 150
//     console.log(finalPrice) // 150return discounted
//   }


// function discountPrices (prices, discount) {
//     let discounted = []
//     for (let i = 0; i < prices.length; i++) {
//       let discountedPrice = prices[i] * (1 - discount)
//       let finalPrice = Math.round(discountedPrice * 100) / 100
//       discounted.push(finalPrice)
//     }console.log(i) // 3
//     console.log(discountedPrice) // 150
//     console.log(finalPrice) // 150return discounted
//   }


//   discountPrices([100, 200, 300], .5)