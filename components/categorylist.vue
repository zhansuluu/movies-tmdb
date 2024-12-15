<template>
    <div class="category-list bg-[#000922] text-white font-prompt px-6 xl:px-16 lg:py-8 md:py-8 xl:py-14 pb-10">
      <div v-for="(category, index) in categories" :key="index" class="category mb-3">
        <h2 class="xl:text-2xl lg:text-2xl md:text-xl sm:text-lg text-lg font-bold mb-1 hover:text-indigo-300 inline-block">{{ category.name }} &gt;</h2>

        <div class="movie-grid flex space-x-3 md:space-x-4 lg:space-x-6 xl:space-x-6 overflow-x-auto  lg:py-4 md:py-4 xl:py-4 custom-scrollbar">
          <div
            v-for="(movie, index) in category.movies"
            :key="index"
            class="movie text-center flex-shrink-0 w-24 md:w-28 xl:w-40 lg:w-40"
          >
            <a :href="`/movie`" @click="saveMovieTitle(movie.title)">
              <img
                :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'path/to/placeholder.jpg'"
                class="w-full xl:w-full lg:w-full md:w-32 rounded-md mb-2"
              >
              <p class=" text-xs md:text-sm lg:text-lg">{{ movie.title }}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        categories: [
          { name: "Fantasy and Sci-fi", movies: [] },
          { name: "Horror", movies: [] },
          { name: "Thriller", movies: []}
        ]
      };
    },
    methods: {
      async fetchMovies() {
        const urls = [
          `https://api.themoviedb.org/3/discover/movie?api_key=2e51d2298001e0dddf6a6ea7553cd801&with_genres=14`,
          `https://api.themoviedb.org/3/discover/movie?api_key=2e51d2298001e0dddf6a6ea7553cd801&with_genres=27`,
          `https://api.themoviedb.org/3/discover/movie?api_key=2e51d2298001e0dddf6a6ea7553cd801&with_genres=53`
        ];

        const fetchPromises = urls.map(url => fetch(url).then(res => res.json()));

        try {
          const [fantasyMovies, horrorMovies, thrillerMovies] = await Promise.all(fetchPromises);

          this.categories[0].movies = fantasyMovies.results;
          this.categories[1].movies = horrorMovies.results;
          this.categories[2].movies = thrillerMovies.results;
        } catch (error) {
          console.error('Error fetching movies:', error);
        }
      },
      saveMovieTitle(title) {
        localStorage.setItem('selectedMovieTitle', title);
      }
    },
    created() {
      this.fetchMovies();
    }
  };
  </script>



<style scoped>
  .custom-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .custom-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  h2::after {
  content: '';
  display: block;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s;
  }

  h2:hover::after {
  width: 100%;
  }
</style>
