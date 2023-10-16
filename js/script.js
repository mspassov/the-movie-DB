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

//Display the popular TV Shows on the listing page
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

//Display the movie details on its movie page
const displayMovieDetails = async () =>{
    const movieId = window.location.search.split('=')[1];
    const response = await fetchAPIData(`movie/${movieId}`);
    const div = document.createElement('div');

    div.innerHTML =
    `<div class="details-top">
          <div>
            <img
              src="${response.poster_path ? `https://image.tmdb.org/t/p/w500${response.poster_path}` : '../images/no-image.jpg'}"
              class="card-img-top"
              alt='${response.original_title}'
            />
          </div>
          <div>
            <h2>${response.original_title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${Math.ceil(response.vote_average)} / 10
            </p>
            <p class="text-muted">Release Date: ${response.release_date}</p>
            <p>${response.overview}</p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${                
                response.genres.map((genre) =>{
                    const li = `<li>${genre.name}</li>`;
                    return li;
                }).join('')
              }
            </ul>
            <a href='${response.homepage}' target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${response.budget.toLocaleString('en-US')}</li>
            <li><span class="text-secondary">Revenue:</span> $${response.revenue.toLocaleString('en-US')}</li>
            <li><span class="text-secondary">Runtime:</span> ${response.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${response.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
              ${
                response.production_companies.map((pc) =>{
                    return `${pc.name}`
                }).join(', ')
              }
          </div>
        </div>`;

        document.querySelector('#movie-details').appendChild(div);
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
            displayMovieDetails();
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