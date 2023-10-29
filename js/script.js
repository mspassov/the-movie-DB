const globalState = {
    currentPage: window.location.pathname,
    search: {
        mediaType: '',
        keywords: '',
        page: 1,
        totalPages: 1,
        totalResults: 0
    }
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

const fetchSearchResults = async () =>{
    const API_KEY = 'f3ab67acf3923abec3aca78fa84b47c8';
    const API_URL = 'https://api.themoviedb.org/3/';

    showSpinner();
    const res = await fetch(`${API_URL}search/${globalState.search.mediaType}?api_key=${API_KEY}&query=${globalState.search.keywords}&page=${globalState.search.page}&language=en-US`);
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

const search = async () =>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    globalState.search.mediaType = urlParams.get('type');
    globalState.search.keywords = urlParams.get('search-term');

    if(globalState.search.keywords != '' && globalState.search.keywords != null){
        const {results, total_pages: totalPages, page, total_results} = await fetchSearchResults();
        
        globalState.search.page = page;
        globalState.search.totalPages = totalPages;
        globalState.search.totalResults = total_results;

        //Clear the previous page
        document.querySelector('#search-results').innerHTML = '';
        document.querySelector('#search-results-heading').innerHTML = '';
        document.querySelector('#pagination').innerHTML = '';
        
        const resultsHeading = document.querySelector('#search-results-heading');
        const h2 = document.createElement('h2');
        h2.innerHTML = `${results.length * globalState.search.page} of ${ globalState.search.totalResults} for search: ${globalState.search.keywords}`;
        resultsHeading.appendChild(h2);

        if(results.length == 0){
            showSearchAlert('There are no results matching this search', 'alert-error');
        }
        else{
            results.forEach((el) =>{
                const div = document.createElement('div');
                div.classList.add('card');
                div.innerHTML = 
                `<div class="card">
                    <a href="${globalState.search.mediaType}-details.html?id=${el.id}">
                        <img
                            src="${el.poster_path ? `https://image.tmdb.org/t/p/w500${el.poster_path}` : '../images/no-image.jpg'}"
                            class="card-img-top"
                            alt='${globalState.search.mediaType == 'movie' ? el.title : el.name}'
                        />
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">${globalState.search.mediaType == 'movie' ? el.title : el.name}</h5>
                        <p class="card-text">
                        <small class="text-muted">Release: ${globalState.search.mediaType == 'movie' ? el.release_date : el.first_air_date}</small>
                        </p>
                    </div>
                </div>`
                document.getElementById('search-results').appendChild(div);
            })
        }
    }
    else{
        showSearchAlert('Please enter a search before submitting', 'alert-error');
    }

    //Create the pagination
    const div = document.createElement('div');
    div.classList.add('pagination');
    div.innerHTML = 
        ` <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${globalState.search.page} of ${globalState.search.totalPages}</div>
        `
    document.querySelector('#pagination').appendChild(div);

    //Check if first or last page to disbale Prev / Next buttons
    if(globalState.search.page == 1){
        document.querySelector('#prev').disabled = true;
    }
    if(globalState.search.page == globalState.search.totalPages){
        document.querySelector('#next').disabled = true;
    }

    //Functionality for moving Next / Prev
    document.querySelector('#next').addEventListener('click', async () =>{
        globalState.search.page++;
        await search();
    })

    document.querySelector('#prev').addEventListener('click', async () =>{
        globalState.search.page--;
        await search();
    })

}

//Show alert when submitting search results
const showSearchAlert = (message, className) =>{
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', className);
    alertDiv.appendChild(document.createTextNode(message));
    document.querySelector('#alert').appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
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

    //Backdrop using the background image
    displayBackdrop('movie', response.backdrop_path);

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

//Display the Show details on the Show Details Page
const displayShowDetails = async () =>{
    const showId = window.location.search.split('=')[1];
    const response = await fetchAPIData(`tv/${showId}`);

    displayBackdrop('show', response.backdrop_path);

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
            <h2>${response.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${Math.ceil(response.vote_average)} / 10
            </p>
            <p class="text-muted">Release Date: ${response.first_air_date}</p>
            <p>${response.overview}</p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${response.genres.map(({name}) =>{
                    return `<li>${name}</li>`
                }).join('')}
            </ul>
            <a href="${response.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${response.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${response.last_episode_to_air.air_date}
            </li>
            <li><span class="text-secondary">Status:</span> ${response.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
                ${
                    response.production_companies.map(({name}) =>{
                        return name;
                    }).join(', ')
                }
          </div>
        </div>
    `;
    document.querySelector('#show-details').appendChild(div);
}

//Display the Slider movies on the homepage
const displaySlider = async () =>{
    const {results: movieArray} = await fetchAPIData('movie/now_playing');
    console.log(movieArray[0]);

    movieArray.forEach((movie) =>{
        const div = document.createElement('div');
        div.classList.add('swiper-slide');
        div.innerHTML = 
        `<a href="movie-details.html?id=${movie.id}">
            <img
                src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '../images/no-image.jpg'}"
                class="card-img-top"
                alt='${movie.original_title}'
            />
        </a>
        <h4 class="swiper-rating">
            <i class="fas fa-star text-secondary"></i> ${Math.ceil(movie.vote_average)} / 10
        </h4>`;

        document.querySelector('.swiper-wrapper').appendChild(div);
        
        initSwiper();   //Calls to initialize the swiper
    })

}

//Initialize the swiper
const initSwiper = () =>{
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 1000,
            disableOnInteraction: true,
        },
        breakpoints: {
            500: {
                slidesPerView: 2
            },
            700: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            }
        }
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

//Display the backdrop image on the Movie / TV Show pages
const displayBackdrop = (mediaType, pathURL) =>{
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${pathURL})`;
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1';

    if(mediaType == 'movie'){
        document.getElementById('movie-details').appendChild(overlayDiv);
    }
    else{
        document.getElementById('show-details').appendChild(overlayDiv);    
    }
}

//Simple router for the web application
const init = () =>{
    switch(globalState.currentPage){
        case '/':
        case '/index.html':
            displayPopularMovies();
            displaySlider();
            break;
        case '/movie-details.html':
            displayMovieDetails();
            break;
        case '/search.html':
            search();
            break;
        case '/shows.html':
            displayTVShows();
            break;
        case '/shows':
            displayTVShows();
            break;    
        case '/tv-details.html':
            displayShowDetails();
            break;
    }

    highlightLinks();
}


document.addEventListener('DOMContentLoaded', init);