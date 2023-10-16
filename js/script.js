const globalState = {
    currentPage: window.location.pathname
};

//General Fetch for TMDB data
const fetchAPIData = async (endpoint) =>{
    const API_KEY = 'f3ab67acf3923abec3aca78fa84b47c8';
    const API_URL = 'https://api.themoviedb.org/3/';

    showSpinner();
    const res = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    hideSpinner();

    return data;
}

const showSpinner = () =>{
    const spinner = document.querySelector('.spinner');
    spinner.classList.add('show');
}

const hideSpinner = () =>{
    const spinner = document.querySelector('.spinner');
    spinner.classList.remove('show');
}

//Display the popular movies on the homepage
const displayPopularMovies = async () =>{
    const { results: popMovies } = await fetchAPIData('movie/popular');
    const movieGrid = document.querySelector('#popular-movies');
    
    //Create new movie cards
    popMovies.forEach((movie) =>{
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                <img
                src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '../images/no-image.jpg'}"
                class="card-img-top"
                alt="${movie.title}"
                />
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                    <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
            </div>`
        movieGrid.appendChild(div);
    })

}

const displayTVShows = async () =>{
    const { results: popShows } = await fetchAPIData('tv/popular');
    const showGrid = document.querySelector('#popular-shows');
    console.log(popShows[0])
    //Create new TV Shows cards
    popShows.forEach((show) =>{
        const div = document.createElement('div');
        div.innerHTML = 
        `<div class="card">
          <a href="tv-details.html?id=${show.id}">
            <img
              src="${show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '../images/no-image.jpg'}"
              class="card-img-top"
              alt="${show.name}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${show.first_air_date}</small>
            </p>
          </div>
        </div>`
        showGrid.appendChild(div);
    })

}

//Highlight the active links
const highlightLinks = () =>{
    linksList = document.querySelectorAll('.nav-link');
    linksList.forEach((li) =>{
        if(li.getAttribute('href') == globalState.currentPage){
            li.classList.add('active');
        }
    })
}

//Simple router for the web application
const init = () =>{
    switch(globalState.currentPage){
        case '/':
        case '/index.html':
            displayPopularMovies();
            break;
        case '/movie-details.html':
            console.log('Movie Details');
            break;
        case '/search.html':
            console.log('Search Page');
            break;
        case '/shows.html':
            displayTVShows();
            break;
        case '/tv-details.html':
            console.log('TV Details');
            break;
    }

    highlightLinks();
}



document.addEventListener('DOMContentLoaded', init);