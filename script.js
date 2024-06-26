const API_KEY = 'YOUR_TMDB_API_KEYhttps://api.themoviedb.org/3/movie/550?api_key=8f1b31a654206bcef67b87eb4e3b50d2'; // Replace with your TMDB API key
const API_URL = 'https://api.themoviedb.org/3/search/movie';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

document.getElementById('search-input').addEventListener('input', async (event) => {
    const query = event.target.value.trim();
    if (query.length > 0) {
        const cachedData = localStorage.getItem(query);
        if (cachedData) {
            displayMovies(JSON.parse(cachedData));
        } else {
            try {
                const response = await fetch(`${API_URL}?api_key=${API_KEY}&query=${query}`);
                if (!response.ok) throw new Error('API request failed');
                const data = await response.json();
                localStorage.setItem(query, JSON.stringify(data.results));
                displayMovies(data.results);
            } catch (error) {
                showError('Failed to fetch movie data. Please try again later.');
            }
        }
    } else {
        clearMovies();
    }
});

function displayMovies(movies) {
    const movieCardsContainer = document.getElementById('movie-cards');
    movieCardsContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${IMG_BASE_URL}${movie.poster_path}" alt="${movie.title}">
            <div class="movie-card-content">
                <h3 class="movie-card-title">${movie.title}</h3>
                <p class="movie-card-description">${movie.release_date}</p>
            </div>
        `;
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));
        movieCardsContainer.appendChild(movieCard);
    });
}

function clearMovies() {
    const movieCardsContainer = document.getElementById('movie-cards');
    movieCardsContainer.innerHTML = '';
}

async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);
        if (!response.ok) throw new Error('API request failed');
        const movie = await response.json();
        const movieDetailsContainer = document.getElementById('movie-details');
        movieDetailsContainer.style.display = 'block';
        movieDetailsContainer.innerHTML = `
            <h2>${movie.title}</h2>
            <p>${movie.overview}</p>
            <h3>Cast</h3>
            <ul>
                ${movie.credits.cast.slice(0, 10).map(cast => `<li>${cast.name} as ${cast.character}</li>`).join('')}
            </ul>
            <h3>Ratings</h3>
            <p>Average Rating: ${movie.vote_average}</p>
        `;
    } catch (error) {
        showError('Failed to fetch movie details. Please try again later.');
    }
}

function showError(message) {
    const movieCardsContainer = document.getElementById('movie-cards');
    movieCardsContainer.innerHTML = `<div class="error-message">${message}</div>`;
}
