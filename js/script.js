const globalState = {
    currentPage: window.location.pathname
};

//General Fetch for TMDB data
const fetchAPIData = async (endpoint) =>{
    const API_KEY = 'f3ab67acf3923abec3aca78fa84b47c8';
    const API_URL = 'https://api.themoviedb.org/3/';

    const res = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();

    return data;
}

//Display the popular movies on the homepage
const displayPopularMovies = async () =>{
    const { results: popMovies } = await fetchAPIData('movie/popular');
    const movieGrid = document.querySelector('#popular-movies');
    console.log(popMovies[0]);
    //Create new movie card
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
            console.log('Shows');
            break;
        case '/tv-details.html':
            console.log('TV Details');
            break;
    }

    highlightLinks();
}



document.addEventListener('DOMContentLoaded', init);