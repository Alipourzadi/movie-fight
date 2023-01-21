let leftMovie;
let rightMovie;

async function onMovieSelect(movie, target, side) {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "91b77543",
      i: movie.imdbID,
    },
  });

  target.querySelector(".main-content").innerHTML = addMovie(response.data);

  if (side == "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
}

const runComparison = () => {
  const rightStats = document.querySelectorAll("#r-autocomplete .stat");
  const leftStats = document.querySelectorAll("#l-autocomplete .stat");
  console.log(rightStats, leftStats);
  rightStats.forEach((rightStat, idx) => {
    const leftStat = leftStats[idx];

    const rightStatValue = rightStat.dataset.value;
    const leftStatValue = leftStat.dataset.value;

    if (rightStatValue > leftStatValue) {
      rightStat.classList.add("is-better");
    } else {
      leftStat.classList.add("is-better");
    }
  });
};

const addMovie = (movie) => {
  const boxOffice = parseInt(
    movie.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const imdb = parseFloat(movie.Ratings[0].Value.split("/")[0]);
  const rottenTomatos = parseInt(movie.Ratings[1].Value.split("%")[0]);
  const metaScore = parseInt(movie.Ratings[2].Value.split("/")[0]);
  const awards = movie.Awards.split(" ").reduce((acc, val) => {
    if (isNaN(parseInt(val))) return acc;
    else return acc + parseInt(val);
  }, 0);

  console.log(imdb, rottenTomatos, metaScore, awards, boxOffice, movie);
  return `
        <div class="detail-content">
          <img src="${movie.Poster}"/>
          <div class="plot-content">
            <div id='title'>
              <h3>${movie.Title}</h3>
              <p class="title-detail">(${movie.Genre})</p>
              <p class="title-detail">${movie.Rated} . ${movie.Runtime}</p>
            </div>
            <p>${movie.Plot}</p>
              <div class="gdat">
                <p>Director : ${movie.Director}</p>
                <p>Actors : ${movie.Actors}</p>
              </div>
          </div>
        </div>
        <div class="rating">
          <div data-value=${imdb} class="rating-content stat">
            <p>IMDB</p>
            <h4>${movie.Ratings[0].Value}</h4>
          </div>
          <div data-value=${rottenTomatos} class="rating-content stat">
            <p>${movie.Ratings[1].Source}</p>
            <h4>${movie.Ratings[1].Value}</h4>
          </div>
          <div data-value=${metaScore} class="rating-content stat">
            <p>${movie.Ratings[2].Source}</p>
            <h4>${movie.Ratings[2].Value}</h4>
          </div>
        </div>
        <div data-value=${boxOffice} class="box-office detail-box stat">
          <p>Box Office</p>
          <h4>${movie.BoxOffice}</h4>
        </div>
        <div data-value=${awards} class="awards detail-box stat">
          <p>Awards</p>
          <h4>${movie.Awards}</h4>
        </div>
  `;
};

const autocompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

    return `
      <a href="" class="option">
          <img src="${imgSrc}"/>
          <p>${movie.Title} (${movie.Year})</p>
      </a>
      `;
  },
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "aa210470",
        s: searchTerm,
      },
    });
    if (response.data.Error) return [];
    return response.data.Search;
  },
};

autocomplete({
  root: document.querySelector("#l-autocomplete"),
  ...autocompleteConfig,
  onOptionSelect(movie, root) {
    onMovieSelect(movie, root, "left");
  },
});

autocomplete({
  root: document.querySelector("#r-autocomplete"),
  ...autocompleteConfig,
  async onOptionSelect(movie, root) {
    onMovieSelect(movie, root, "right");
  },
});
