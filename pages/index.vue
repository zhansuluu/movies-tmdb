<template>
  <div class="bg-[rgb(0,9,34)] w-full min-h-screen text-white font-prompt relative">
    <transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-[#0a0a0a] rounded-lg shadow-lg w-11/12 sm:w-96 p-6 relative">
          <button @click="closeModalAuthorize" class="absolute top-3 right-3 text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <h2 class="text-2xl font-semibold mb-4 text-center">
            {{ isLogin ? 'Login' : 'Register' }}
          </h2>
          <form @submit.prevent="handleAuth" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium">Email</label>
              <input
                type="email"
                id="email"
                v-model="user.email"
                required
                class="w-full mt-1 p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              >
            </div>
            <div>
              <label for="password" class="block text-sm font-medium">Password</label>
              <input
                type="password"
                id="password"
                v-model="user.password"
                required
                class="w-full mt-1 p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your password"
              >
            </div>
            <div v-if="!isLogin">
              <label for="confirmPassword" class="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="user.confirmPassword"
                required
                class="w-full mt-1 p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Confirm your password"
              >
            </div>
            <div v-if="authError" class="text-red-500 text-sm">
              {{ authError }}
            </div>
            <button
              type="submit"
              class="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-semibold"
            >
              {{ isLogin ? 'Login' : 'Register' }}
            </button>
          </form>
          <p class="mt-4 text-center text-sm">
            {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
            <button @click="toggleAuthMode" class="text-indigo-400 hover:underline">
              {{ isLogin ? 'Register' : 'Login' }}
            </button>
          </p>
        </div>
      </div>
    </transition>

    <header :class="headerClass" class="header fixed top-0 left-0 w-full flex justify-between md:px-16 lg:px-20 xl:px-44 px-9 py-6 z-20 transition-all duration-300 ease-in-out">
      <button @click="navigateToFavorites" class="rounded-xl px-2 hover:bg-white hover:bg-opacity-10">
        <img src="https://img.icons8.com/?size=64&id=ljAyc70Q3y6I&format=png&color=FFFFFF" class="xl:w-14 w-8 lg:w-12 sm:w-10 opacity-60 hover:opacity-100">
      </button>
      <form class="flex justify-between sm:w-8/12 md:w-8/12 lg:w-7/12 xl:w-6/12 relative" autocomplete="off">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Find movies, TV shows and more"
          class="p-6 placeholder-white placeholder-opacity-90 font-light rounded sm:w-11/12 xl:w-10/12 lg:w-10/12 md:w-11/12 xl:p-3 lg:p-3 md:p-3 sm:p-2 text-sm sm:text-md md:text-lg lg:text-xl xl:text-xl py-0 px-2 bg-white bg-opacity-5 focus:bg-opacity-10 outline-gray-900"
          @input="autocomplete($event)"
        >
        <button type="button" @click="searchMovie" class="rounded-2xl px-2 hover:bg-white hover:bg-opacity-5">
          <img src="https://img.icons8.com/?size=48&id=PcEVP5coxbVZ&format=png&color=FFFFFF" class="xl:w-12 w-8 lg:w-12 sm:w-10 opacity-60 hover:opacity-100" alt="">
        </button>
        <div v-if="suggestions.length" class="absolute bg-[rgb(0,9,34)] text-gray-400 w-10/12 xl:w-10/12 lg:w-10/12 sm:w-11/12 md:w-11/12 max-h-60 overflow-y-auto text-sm md:text-lg lg:text-lg sm:text-md xl:text-xl mt-8 xl:mt-14 md:mt-12 lg:mt-13 sm:mt-10 transition-all">
          <div
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="w:p-3 p-2 cursor-pointer hover:bg-slate-800 hover:text-white transition-all"
            @click="selectSuggestion(suggestion)"
          >
            {{ suggestion }}
          </div>
        </div>
      </form>

      <button @click="showModalAuthorize" class="rounded-xl px-2 hover:bg-white hover:bg-opacity-10">
        <img class="xl:w-12 w-8 lg:w-10 sm:w-10 opacity-60 hover:opacity-100" src="https://img.icons8.com/?size=100&id=JFpp84FpjBA0&format=png&color=FFFFFF">
      </button>
    </header>

    <div class="w-full h-[50vh] sm:h-[60vh] md:h-[65vh] lg:h-[78vh] xl:h-[80.33vh] overflow-hidden relative">
      <transition name="fade">
        <img  id="mainimg" :src="currentMovie.image" :key="currentMovie.image" class="absolute opacity-50 w-full h-5/6 md:h-[65.33vh] lg:h-[70vh] xl:w-full xl:h-[80vh] object-cover">
      </transition>
      <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
      <div class="text-white z-10 relative xl:ml-36 xl:px-12 mt-24 ml-12 md:mt-48 md:ml-20 lg:ml-24 lg:mt-60 xl:mt-72">
        <h1 class="xl:text-6xl md:text-4xl lg:text-5xl text-2xl font-bold">{{ currentMovie.title }}</h1>
        <p class="xl:text-xl md:text-lg lg:text-xl text-sm mt-2 font-light opacity-80">{{ currentMovie.year }} · {{ currentMovie.duration }}</p>
        <p class="xl:text-xl md:text-lg lg:text-xl text-sm font-light opacity-80">{{ currentMovie.genre }}</p>
        <button @click="saveMovieTitle(currentMovie.title)" @mouseover="pauseRotation" @mouseleave="resumeRotation" class="inline-block xl:mt-5 mt-3 md:text-xl sm:text-lg lg:text-xl lg:px-4 text-white font-bold hover:bg-opacity-70 hover:bg-indigo-300 hover:text-slate-950 hover:font-bold bg-white bg-opacity-10 xl:px-6 xl:py-3 py-1 px-2 md:px-3 rounded xl:text-xl text-sm transition-opacity">Watch now</button>
      </div>
    </div>

    <div class="relative xl:top-10 top-0">
      <CategoryList />
    </div>
  </div>
</template>


<script>
import CategoryList from '../components/categorylist.vue';

export default {
  components: {
    CategoryList
  },
  data() {
    return {
      showModal: false, // Controls modal visibility
      isLogin: true,    // Toggles between Login and Register
      user: {
        email: '',
        password: '',
        confirmPassword: '', // Only used for registration
      },
      authError: '', // To display authentication errors
      searchQuery: "",
      suggestions: [],
      movies: [
        {
          title: "La La Land",
          image: "https://www.nyfa.edu/wp-content/uploads/2023/12/lalaland.jpg",
          year: "2016",
          duration: "2h 8min",
          genre: "Musical | Romance",
          link: "/movie"
        },
        {
          title: "Le Fabuleux Destin d'Amélie Poulain",
          image: "https://aquiacola.net/wp-content/uploads/2015/05/1063717_486972178038734_245520779_o.jpg?w=1540&h=799&crop=1",
          year: "2001",
          duration: "2h 2min",
          genre: "Romantic Comedy",
          link: "/movie"
        },
        {
          title: "Donnie Darko",
          image: "https://static3.coolconnections.ru/images/10014/standard/hd/74b79757ab7eb4e10658133aefa5eeb0f848601a.jpg?1532686590",
          year: "2001",
          duration: "2h 26min",
          genre: "Sci-fi | Thriller",
          link: "/movie"
        },
        {
          title: "Spider-Man: Across the Spider-Verse",
          image: "https://images7.alphacoders.com/131/1317117.jpeg",
          year: "2023",
          duration: "2h 20min",
          genre: "Animation | Action",
          link: "/movie"
        },
        {
          title: "Pulp Fiction",
          image: "https://static1.srcdn.com/wordpress/wp-content/uploads/2022/06/Pulp-Fiction-vincent-and-mia-win-the-dance-contest.jpg",
          year: "1994",
          duration: "2h 34min",
          genre: "Crime | Drama",
          link: "/movie"
        }
      ],
      currentIndex: 0,
      intervalId: null,
      headerClass: 'bg-header-transparent',
    };
  },
  computed: {
    currentMovie() {
      return this.movies[this.currentIndex];
    }
  },
  methods: {
    showModalAuthorize() {
      if (localStorage.getItem('authToken')) {
        this.$router.push({ path: '/user-profile' });
      } else {
        this.showModal = true;
        // Optionally reset form fields and errors when opening the modal
        this.isLogin = true;
        this.user = {
          email: '',
          password: '',
          confirmPassword: '',
        };
        this.authError = '';
      }
    },
    closeModalAuthorize() {
      this.showModal = false;
    },
    toggleAuthMode() {
      this.isLogin = !this.isLogin;
      this.authError = '';
      // Clear password fields when toggling
      this.user.password = '';
      this.user.confirmPassword = '';
    },
    async handleAuth() {
      if (this.isLogin) {
        await this.login();
      } else {
        await this.register();
      }
    },

    async login() {
      // Implement your login logic here (e.g., API call)
      try {
        // Example API call
        const response = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.user.email,
            password: this.user.password,
          }),
        });

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const data = await response.json();
        // Handle successful login (e.g., save token, redirect)
        console.log(this.user.email, this.user.password, data.accessToken);
        localStorage.setItem('authToken', data.accessToken);
        this.closeModalAuthorize();
        // Optionally refresh or redirect
      } catch (error) {
        this.authError = error.message;
      }
    },
    async register() {
      // Implement your registration logic here (e.g., API call)
      if (this.user.password !== this.user.confirmPassword) {
        this.authError = 'Passwords do not match';
        return;
      }

      try {
        // Example API call
        const response = await fetch('http://localhost:8080/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.user.email,
            password: this.user.password,
          }),
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }

        const data = await response.json();
        console.log(this.user.email, this.user.password, data.token);
        // Handle successful registration (e.g., auto-login, redirect)
        this.closeModalAuthorize();
        // Optionally refresh or redirect
      } catch (error) {
        this.authError = error.message;
      }
    },
    scrollHeader() {
      window.addEventListener('scroll', () => {
        this.headerClass = window.pageYOffset > 50 ? 'bg-header-solid' : 'bg-header-transparent';
      });
    },
    navigateToFavorites() {
      this.$router.push({ path: '/watchlist' });
    },
    async autocomplete(event) {
      const query = event.target.value;
      if (!query) {
        this.suggestions = [];
        return;
      }
      try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=2e51d2298001e0dddf6a6ea7553cd801&query=${query}`);
        const data = await response.json();
        this.suggestions = data.results.map(movie => movie.original_title);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    },
    selectSuggestion(suggestion) {
      this.searchQuery = suggestion;
      this.suggestions = [];
    },
    searchMovie() {
      if (this.searchQuery) {
        localStorage.setItem('selectedMovieTitle', this.searchQuery);
        window.location.href = '/movie';
      } else {
        console.log('Фильм не выбран');
      }
    },
    saveMovieTitle(title) {
      localStorage.setItem('selectedMovieTitle', title);
      window.location.href = this.movies.find(movie => movie.title === title).link;
    },
    closeAllLists(event) {
      if (!event.target.closest("form")) {
        this.suggestions = [];
      }
    },
    startRotation() {
      this.intervalId = setInterval(this.nextMovie, 4000);
    },
    nextMovie() {
      this.currentIndex = (this.currentIndex + 1) % this.movies.length;
    },
    pauseRotation() {
      clearInterval(this.intervalId);
    },
    resumeRotation() {
      this.startRotation();
    }
  },
  mounted() {
    this.startRotation();
    this.scrollHeader();
    document.addEventListener("click", this.closeAllLists);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
    document.removeEventListener("click", this.closeAllLists);
  }
}
</script>

<style>
/* Modal fade-in and fade-out transitions */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-to, .modal-leave-from {
  opacity: 1;
}
</style>
