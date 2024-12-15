<template>
  <div class="bg-[rgb(0,9,34)] w-full min-h-screen text-white font-prompt text-xl px-8 sm:px-12 sm:py-6 md:px-20 md:py-8 lg:px-32 lg:py-12 py-4 xl:px-52 xl:py-10 overflow-x-hidden">
    <Modal
      v-if="isModalOpen"
      :isOpen="isModalOpen"
      :title="modalTitle"
      :value="modalValue"
      :placeholder="modalPlaceholder"
      @close="closeModal"
      @save="handleSave"
    />

    <header class="xl:mb-10 mb-5">
      <button @click="navigateToHome" class="rounded-xl px-2 hover:bg-white hover:bg-opacity-10">
        <img src="https://img.icons8.com/?size=50&id=XxnUxbtDd3Q3&format=png&color=FFFFFF" class="xl:w-12 lg:w-11 w-9 opacity-60 hover:opacity-100">
      </button>
    </header>

    <div class="flex flex-col items-center bg-white bg-opacity-5 rounded-md backdrop-blur-sm p-6 md:p-10 lg:p-14 xl:p-20">
      <div class="flex flex-col items-center mb-8">
        <img
          :src="userProfile.avatar || 'https://via.placeholder.com/150'"
          alt="User Avatar"
          class="rounded-full w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 mb-4"
        />
        <h1 class="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">{{ userProfile.name }}</h1>
      </div>

      <div class="w-full max-w-2xl">
        <div class="mb-6">
          <h2 class="text-xl md:text-2xl lg:text-3xl font-semibold mb-2">User Information</h2>
          <p class="text-sm md:text-base lg:text-lg">Email: {{ userProfile.email }}</p>
          <!-- Добавьте дополнительные поля профиля при необходимости -->
        </div>

        <div class="flex space-x-4">
          <button
            @click="updateName"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Edit name
          </button>
          <button
            @click="logout"
            class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import { User } from "models/models"
import Modal from "@/components/Modal.vue";
import { defineComponent, ref, onMounted } from "vue";
export default {
  components: Modal,
  data() {
    return {
      userProfile: {
        email: '',
        avatar: ''
      },
      isModalOpen: ref(false),
      modalTitle: ref(""),
      modalValue: ref(""),
      modalPlaceholder: ref(""),
      tempUser: ref(null),
    };
  },
  mounted() {
    this.fetchProfile();
  },
  created() {
    if (process.client) {
      this.loadUserProfile();
    }
  },
  methods: {
    async fetchProfile() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          this.userProfile.email = 'Неизвестный пользователь';
          return;
        }
        const response = await fetch('http://localhost:8080/protected/me', {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.tempUser = data
        // Проверяем наличие необходимых полей в ответе
        this.userProfile.email = data.email || 'Неизвестный пользователь';
        this.userProfile.avatar = data.avatar || '';
        this.userProfile.name = data.name || '';
        // Сохраняем данные пользователя в localStorage (опционально)
        localStorage.setItem('userProfile', JSON.stringify(data));
      } catch (err) {
        this.error = err.message || 'Ошибка получения профиля';
        console.error("Error fetching profile:", err);
        this.userProfile.email = 'Неизвестный пользователь';
      }
    },
    async fetchUpdateMe(updatedData) {
      try {
        console.log("Sending Data:", updatedData);
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No auth token found");
        }
        const response = await fetch('http://localhost:8080/protected/me', {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response Data:", data);
        this.userProfile = data;
        // Обновляем данные пользователя в localStorage (опционально)
        localStorage.setItem('userProfile', JSON.stringify(data));
      } catch (err) {
        this.updateError = err.message || 'Ошибка обновления профиля';
        console.error("Error updating profile:", err);
      }
    },
    updateName() {
      this.openModal("name", "Update Name", "Enter your new name");
    },
    openModal(key, title, placeholder){
      console.log(key, title, placeholder, this.tempUser.name);
      this.isModalOpen = true;
      this.modalTitle = title;
      this.modalValue = "";
    },
    loadUserProfile() {
      const accountToken = localStorage.getItem('authToken');
      console.log(accountToken)
      if (accountToken) {
        this.fetchProfile();
        // Предполагается, что информация о пользователе хранится под ключом accountToken
        const storedUser = JSON.parse(localStorage.getItem(accountToken));
        if (storedUser) {
          this.userProfile.email = storedUser.email || 'Н/Д';
          this.userProfile.avatar = storedUser.avatar || ''; // Предполагается, что есть поле avatar
        } else {
          this.userProfile.email = 'Неизвестный пользователь';
        }
      } else {
        this.userProfile.email = 'Неизвестный пользователь';
      }
    },
    navigateToHome() {
      this.$router.push({ path: '/' });
    },
    navigateToEditProfile() {
      this.$router.push({ path: '/edit-profile' }); // Предполагается, что есть страница редактирования профиля
    },
    async handleSave(newValue){
      if (this.userProfile) {
          try {
            await this.fetchUpdateMe({
              name: newValue,
            });
            this.userProfile.name = newValue;
            location.reload();
          } catch (err) {
            console.error("Error saving profile:", err);
            alert("Failed to save profile.");
          }
      }
      this.closeModal();
    },
    closeModal() {
      this.isModalOpen = false;
    },
    logout() {
      localStorage.removeItem('authToken');
      this.$router.push({ path: '/' });
    }
  }
};
</script>

<style scoped>
/* Добавьте дополнительные стили при необходимости */
</style>
