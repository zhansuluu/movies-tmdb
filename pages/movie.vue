<template>
  <div class="bg-[rgb(0,9,34)] w-full min-h-screen text-white font-prompt text-xl px-8 sm:px-12 sm:py-6 md:px-20 md:py-8 lg:px-32 lg:py-12 py-4 xl:px-52 xl:py-10 overflow-x-hidden">
    <div v-if="error" class="xl:text-xl mb-2 flex flex-col justify-center items-center h-[85vh] tracking-widest">
      <h1 class="text-sm sm:text-md md:text-lg my-1 lg:text-xl xl:text-2xl md:my-2">{{ error }}</h1>
      <h2 class="text-6xl md:text-7xl xl:text-8xl my-1">OOPS...</h2>
      <button @click="navigateToHome()" class="rounded-xl  border p-2 sm:p-3 text-sm sm:text-md md:text-lg lg:text-xl xl:text-2xl lg:px-4 xl:px-5 my-2 md:my-3">Back Home</button>
    </div>

    <header v-if="movie" class="xl:mb-8 mb-2 md:mb-5">
      <button @click="navigateToHome()" class="rounded-xl px-1 hover:bg-white hover:bg-opacity-10">
        <img src="https://img.icons8.com/?size=50&id=XxnUxbtDd3Q3&format=png&color=FFFFFF" class="xl:w-12 w-9 opacity-60 hover:opacity-100" />
      </button>
    </header>

    <div v-if="movie" class="flex flex-col items-center xl:py-20 py-10 lg:py-14 space-x-34 font-extralight h-auto bg-white bg-opacity-5 rounded-md backdrop-blur-sm">
      <div class="flex flex-row justify-evenly px-3 md:px-9 xl:px-14 ">
        <div>
          <img id='poster' :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" class="border-4 border-slate-100 xl:w-[250px] w-[100px] sm:w-[120px] md:w-[170px]" />
        </div>

        <div class="w-7/12 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
          <h1><strong>Movie name: </strong>{{ movie.title }}</h1>
          <h1><strong>Year of release: </strong>{{ movie.release_date.split('-')[0] }}</h1>
          <h1><strong>Duration: </strong>{{ formatRuntime(movie.runtime) }}</h1>
          <h1 v-if="movie.genres"><strong>Genres: </strong>{{ movie.genres.map(genre => genre.name).join(', ') }}</h1>
          <h1 v-if="movie.production_countries"><strong>Country: </strong>{{ movie.production_countries.map(country => country.name).join(', ') }}</h1>
          <h1><strong>Rating: </strong>{{ movie.vote_average }} ({{ movie.vote_count }})</h1>
          <h1 class="xl:mt-8 mt-4">
            <span class="font-bold">What is the movie «{{movie.title}}» about:</span>
            <br />
            {{ movie.overview }}
          </h1>
        </div>
      </div>

      <div v-if="movieCredits" class="w-full flex flex-col items-start sm:mt-6 md:mt-6 lg:mt-10 xl:mt-10 mt-5 lg:px-24 xl:px-24 px-6 sm:px-12 md:px-16">
        <h2 class="xl:text-2xl sm:text-base md:text-lg text-sm font-bold lg:text-xl xl:mb-4 mb-2">Starring actors</h2>
        <div class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-2 lg:gap-4 xl:gap-5">
          <div v-for="cast in displayedCast" :key="cast.cast_id" class="flex flex-col items-center">
            <img
              :src="cast.profile_path ? 'https://image.tmdb.org/t/p/w200' + cast.profile_path : 'https://koalaliving.com.au/default-product.png'"
              alt="Cast Image"
              class="rounded-lg w-16 sm:w-20 md:w-28 lg:w-40 xl:w-44 mb-2 "
            />
            <p class="text-center text-xs md:text-sm xl:text-base">{{ cast.name }}</p>
            <p class="text-center text-xs xl:text-base opacity-65">{{ cast.character }}</p>
          </div>
        </div>
        <button v-if="movieCredits.cast.length > 6" @click="toggleShowAll" class="text-indigo-100 text-sm sm:text-base lg:text-lg font-medium hover:text-indigo-300 hover:font-bold">
          {{ showAllCast ? 'Show Less' : 'Show More' }}
        </button>
      </div>

      <div v-if="trailer" class="flex xl:mt-20 mt-5 sm:mt-6 md:mt-8 lg:mt-14">
        <iframe
          class="w-[350px] h-[180px] sm:w-[450px] sm:h-[200px] md:w-[480px] md:h-[240px] lg:w-[680px] lg:h-[300px] xl:w-[770px] xl:h-[380px] pt-0"
          :src="'https://www.youtube.com/embed/' + trailer.key"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>

      <div class="w-full text-xs sm:text-base md:ml-32 xl:ml-48 lg:text-lg xl:text-xl mt-5 lg:mt-7 xl:mt-9  ml-10 lg:ml-44 sm:ml-24 flex justify-start items-center gap-3 font-medium">
        <h1 id="question">{{ !isAddedToWatchlist ? 'Do you want to add to watchlist?' : 'Enjoy watching!' }}</h1>
        <img
          @click="toggleBtn(movie)"
          class="xl:px-2 xl:py-1 px-1 sm:w-10 lg:w-12 xl:w-14 hover:bg-white/15 rounded-lg opacity-40 hover:opacity-90"
          :src="isAddedToWatchlist
            ? 'https://img.icons8.com/?size=30&id=78581&format=png&color=FFFFFF'
            : 'https://img.icons8.com/?size=30&id=60953&format=png&color=FFFFFF'"
        />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      movie: null,
      trailer: null,
      movieCredits: null,
      error: null,
      isAddedToWatchlist: false,
      showAllCast: false,
      screenWidth: null,
    };
  },
  created() {
    if (process.client) {
      this.loadMovie();
      this.updateScreenWidth();
      window.addEventListener('resize', this.updateScreenWidth);
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateScreenWidth);
  },
  computed: {
    displayedCast() {
      if (!this.movieCredits) return [];
      const castCount = this.screenWidth < 640 ? 5 : 6;
      return this.showAllCast
        ? this.movieCredits.cast.slice(0, castCount * 3) // Показываем больше кастов при расширенном просмотре
        : this.movieCredits.cast.slice(0, castCount);
    },
  },
  methods: {
    async loadMovie() {
      const movieTitle = localStorage.getItem('selectedMovieTitle');
      if (movieTitle) {
        try {
          const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=2e51d2298001e0dddf6a6ea7553cd801&query=${movieTitle}`);
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const movieDetailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${data.results[0].id}?api_key=2e51d2298001e0dddf6a6ea7553cd801`);
            const movieDetails = await movieDetailsResponse.json();
            this.movie = movieDetails;
            this.isAddedToWatchlist = this.checkIfAdded(this.movie);

            const responseTrailer = await fetch(`https://api.themoviedb.org/3/movie/${this.movie.id}/videos?api_key=2e51d2298001e0dddf6a6ea7553cd801`);
            const trail = await responseTrailer.json();
            this.trailer = trail.results.find(video => video.type === 'Trailer');

            const responseCredits = await fetch(`https://api.themoviedb.org/3/movie/${this.movie.id}/credits?api_key=2e51d2298001e0dddf6a6ea7553cd801`);
            const credits = await responseCredits.json();
            this.movieCredits = credits;
          } else {
            this.error = 'There is nothing here.';
          }
        } catch (error) {
          this.error = 'There is nothing here.';
        }
      } else {
        this.error = 'There is nothing here.';
      }
    },
    checkIfAdded(movie) {
      let accountToken = localStorage.getItem('authToken')
      const watchlistMovies = JSON.parse(localStorage.getItem(accountToken)) || [];
      return watchlistMovies.some(watchMovie => watchMovie.title === movie.title);
    },
    toggleBtn(movie) {
      let accountToken = localStorage.getItem('authToken')
      let watchlistMovies = JSON.parse(localStorage.getItem(accountToken)) || [];
      if (this.isAddedToWatchlist) {
        watchlistMovies = watchlistMovies.filter(watchMovie => watchMovie.title !== movie.title);
        this.isAddedToWatchlist = false;
        const element = document.querySelector('#question');
        element.textContent = 'Do you want to add to watchlist?';
      } else {
        watchlistMovies.push(movie);
        this.isAddedToWatchlist = true;
        const element = document.querySelector('#question');
        element.textContent = 'Enjoy watching!';
      }
      localStorage.setItem(accountToken, JSON.stringify(watchlistMovies));
    },
    navigateToHome() {
      this.$router.push({ path: '/' });
    },
    toggleShowAll() {
      this.showAllCast = !this.showAllCast;
    },
    formatRuntime(runtime) {
      const hours = Math.floor(runtime / 60);
      const minutes = runtime % 60;
      return `${hours}h ${minutes}min`;
    },
    updateScreenWidth() {
      this.screenWidth = window.innerWidth;
    },
  },
};
</script>

<style scoped>
@media screen and (min-width: 890px) and (max-width: 1024px) {
  iframe {
    width: 600px;
    height: 300px;
  }
}

@media screen and (min-width: 1024px) and (max-width: 1150px){
  iframe{
    width: 580px;
    height: 300px;
  }
}

@media screen and (min-width: 1024px) and (max-width: 1280px){
  p{
    @apply text-base;
  }
  #poster{
    @apply w-[200px];
  }
}

@media screen and (min-width: 1280px) and (max-width: 1400px){
  iframe{
    width: 640px;
    height: 320px;
  }

  #poster{
    @apply w-[220px];
  }
}

</style>
