<template>
  <div class="bg-[rgb(0,9,34)] w-full min-h-screen text-white text-sm sm:text-lg lg:text-xl xl:text-2xl font-prompt px-10 md:px-14 md:py-6 lg:px-32 lg:py-9 py-5 xl:px-56 xl:py-16 overflow-x-hidden">
    <header class="xl:mb-10 mb-5">
      <button @click="navigateToHome" class="rounded-xl px-2 hover:bg-white hover:bg-opacity-10">
        <img src="https://img.icons8.com/?size=50&id=XxnUxbtDd3Q3&format=png&color=FFFFFF" class="xl:w-12 lg:w-11 w-9 opacity-60 hover:opacity-100">
      </button>
    </header>
    <div class="mb-5">
      <h1 class="xl:text-3xl text-xl font-bold">Watchlist</h1>
    </div>
    <div v-if="watchlistMovies.length === 0">
      <p>You have no movies.</p>
    </div>
    <div v-else>
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-white">
            <th class="xl:p-4 p-2 w-2/12"></th>
            <th class="xl:p-4 p-2 w-1/2">Movie Title</th>
            <th class="xl:p-4 p-2">Watched</th>
            <th class="xl:p-4 p-2">Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(movie, index) in watchlistMovies" :key="index" class="border-b border-white">
            <td class="xl:p-4 p-2">
              <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" class=" xl:w-28 w-16 sm:w-20 md:w-20 lg:w-24 rounded-md" />
            </td>
            <td class="xl:p-4 p-2 w-1/2">
              <h1 @click="navigateToMovie(movie.title)" class="hover:underline cursor-pointer">
                {{ movie.title }}
              </h1>
            </td>
            <td class="xl:p-4 p-2">
              <button class="hover:bg-white/10 text-white xl:px-4 px-4 xl:py-2 rounded" @click="toggleWatched(movie)">
                <img src="https://img.icons8.com/?size=50&id=NQKgVgBdVshY&format=png&color=FFFFFF" class="xl:w-11 w-6 sm:w-8 md:w-9" :style="{ opacity: movie.watched ? 1 : 0.3 }" />
              </button>
            </td>
            <td class="xl:p-4 p-2">
              <button @click="removeFromWatchlist(movie)" class="hover:bg-white/10 text-white xl:px-4 px-4 xl:py-2 rounded">
                <img src="https://img.icons8.com/?size=50&id=46&format=png&color=FFFFFF" alt="" class="xl:w-9 w-7 md:w-8">
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      watchlistMovies: []
    };
  },
  created() {
    if (process.client) {
      this.loadWatchlist();
    }
  },
  methods: {
    loadWatchlist() {
      let accountToken = localStorage.getItem('authToken');
      let watchlistMovies = JSON.parse(localStorage.getItem(accountToken)) || [];
      watchlistMovies = watchlistMovies.map(movie => ({ ...movie, watched: movie.watched || false }));
      this.watchlistMovies = watchlistMovies;
    },
    saveWatchlist() {
      let accountToken = localStorage.getItem('authToken');
      localStorage.setItem(accountToken, JSON.stringify(this.watchlistMovies));
    },
    removeFromWatchlist(movie) {
      this.watchlistMovies = this.watchlistMovies.filter(watchlistMovie => watchlistMovie.id !== movie.id);
      this.saveWatchlist();
    },
    toggleWatched(movie) {
      movie.watched = !movie.watched;
      this.saveWatchlist();
    },
    navigateToHome() {
      this.$router.push({ path: '/' });
    },
    formatRuntime(runtime) {
      const hours = Math.floor(runtime / 60);
      const minutes = runtime % 60;
      return `${hours}h ${minutes}min`;
    },
    navigateToMovie(title) {
      localStorage.setItem('selectedMovieTitle', title);
      this.$router.push('/movie');
    }
  }
};
</script>
