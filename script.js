// prepre data
const API_KEY = "3fd2be6f0c70a2a598f084ddfb75487c";
const API_URL_MOVIE = "https://api.themoviedb.org/3";
const IMG_MOVIE_PATH = "https://image.tmdb.org/t/p/w1280";
const PAGE_NUMBER = 1;

// list api data
const API_URL_HOME = `${API_URL_MOVIE}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=${PAGE_NUMBER}`;
const API_URL_SEARCH = `${API_URL_MOVIE}/search/movie?api_key=${API_KEY}&query=`;
const API_URL_NOW_PLAYING = `${API_URL_MOVIE}/movie/now_playing?api_key=${API_KEY}&page=${PAGE_NUMBER}`;
const API_URL_POPULAR = `${API_URL_MOVIE}/movie/popular?api_key=${API_KEY}&page=${PAGE_NUMBER}`;
const API_URL_TOPRATED = `${API_URL_MOVIE}/movie/top_rated?api_key=${API_KEY}&page=${PAGE_NUMBER}`;
const API_URL_TRENDING = `${API_URL_MOVIE}/trending/movie/week?api_key=${API_KEY}`;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const menu = document.getElementById("menu"); // Adjust with your actual menu ID

// Get initial movies
async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();

  showMovies(data.results);
  setHeroBackground(data.results); // Set the hero background with a popular movie
}

function setHeroBackground(movies) {
  if (movies.length > 0) {
    const popularMovie = movies[0]; // Get the first movie
    const hero = document.getElementById("hero");
    hero.style.backgroundImage = `url(${
      IMG_MOVIE_PATH + popularMovie.poster_path
    })`;
    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center center";
  }
}

getMovies(API_URL_HOME);

// Show Movies Function
function showMovies(movies) {
  main.innerHTML = "";

  console.log("movies", movies);

  movies.forEach((movie) => {
    const { title, release_date, poster_path, vote_average, overview, id } =
      movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
            <img src="${IMG_MOVIE_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>
                ${title}
                <br>
                <div class="text-release">Release : ${formatDate(
                  release_date
                )}</div>
                </h3>
                <span class="${getClassByRate(vote_average)}">${parseFloat(
      vote_average
    ).toFixed(2)}</span>
            </div>
            <div class="overview">
            <h3>Overview</h3>
            ${overview}
            <div class="movie-actions">
                <button class="btn-trailer" onclick="getTrailer(${id})">Watch Trailer</button>
                <a href="https://tv.lk21official.pics/search.php?s=${title}" target="_blank" class="btn-watch">Watch Movie</a>
            </div>
        </div>
        `;
    main.appendChild(movieEl);
  });
}

// Fetch Trailer
async function getTrailer(movieId) {
  try {
    const url = `${API_URL_MOVIE}/movie/${movieId}/videos?api_key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const trailers = data.results.filter((video) => video.type === "Trailer");

    if (trailers.length > 0) {
      const trailerKey = trailers[0].key; // Use the first trailer
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank");
    } else {
      alert("Trailer not available for this movie.");
    }
  } catch (error) {
    console.error("Error fetching trailer:", error);
    alert("Unable to fetch trailer at the moment.");
  }
}

// Rate Class Function
function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

// Format Date Function
function formatDate(inputDate) {
  // Convert the input date string to a Date object
  const dateObject = new Date(inputDate);

  // Options for formatting the date
  const options = { day: "numeric", month: "long", year: "numeric" };

  // Format the date using the specified options
  const formattedDate = dateObject.toLocaleDateString("id-ID", options);

  return formattedDate;
}

// Search Functionality
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim(); // Trim any leading or trailing spaces

  if (searchTerm && searchTerm !== "") {
    getMovies(API_URL_SEARCH + searchTerm);
    search.value = ""; // Clear the search input after search
  } else {
    window.location.reload(); // If no search term, reload the page
  }
});

// Set Active Menu Item and Fetch Data
function setActive(clickedElement, filter) {
  // Remove the "active" class from all list items
  var listItems = document.querySelectorAll("li a");
  listItems.forEach(function (item) {
    item.classList.remove("active");
  });

  // Add the "active" class to the clicked list item
  clickedElement.classList.add("active");

  // Fetch and display data based on the clicked filter
  switch (filter) {
    case "home":
      getMovies(API_URL_HOME);
      break;
    case "now-playing":
      getMovies(API_URL_NOW_PLAYING);
      break;
    case "popular":
      getMovies(API_URL_POPULAR);
      break;
    case "top-rated":
      getMovies(API_URL_TOPRATED);
      break;
    case "trending":
      getMovies(API_URL_TRENDING);
      break;
  }

  // Close the menu after clicking a filter
  menu.classList.remove("open"); // Logic to close the menu (you can adjust this if needed)
}

// Close the menu when clicking outside
function closeMenuOnClickOutside() {
  window.addEventListener("click", (e) => {
    const isClickInside = menu.contains(e.target);
    if (!isClickInside) {
      menu.classList.remove("open"); // Add your logic for closing the menu
    }
  });
}

// Call the function to close the menu when clicking outside
closeMenuOnClickOutside();
function closeMenuOnClickOutside() {
  window.addEventListener("click", (e) => {
    // Pastikan elemen menu tersedia
    if (!menu) return;

    // Periksa apakah klik terjadi di dalam elemen menu
    const isClickInside = menu.contains(e.target);
    if (!isClickInside) {
      // Tutup menu jika klik di luar elemen menu
      menu.classList.remove("open");
    }
  });
}
// Fungsi untuk toggle menu (buka/tutup)
function toggleMenu() {
  menu.classList.toggle("open");
}

// Tangkap tombol hamburger dan tambahkan event listener
const hamburgerButton = document.getElementById("hamburger"); // Pastikan elemen ini ada di HTML
if (hamburgerButton) {
  hamburgerButton.addEventListener("click", toggleMenu);
}
