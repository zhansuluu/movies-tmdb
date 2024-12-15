<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content bg-black bg-opacity-50">
      <h3 class="font-black mb-5 text-xl">{{ title }}</h3>
      <input
        v-model="inputValue"
        :placeholder="placeholder"
        class="w-full mt-1 p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        type="text"
      />
      <div class="modal-actions mt-3">
        <button @click="closeModal"
                class="font-black bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-md"
        >Cancel</button>
        <button @click="saveChanges"
                class="font-black bg-green-600 hover:bg-green-700 px-4 py-3 rounded-md"
        >Save</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  props: {
    isOpen: { type: Boolean, required: true },
    title: { type: String, required: true },
    placeholder: { type: String, default: "Enter value" },
    value: { type: String, required: true },
  },
  emits: ["close", "save"],
  data() {
    return {
      inputValue: this.value,
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    saveChanges() {
      this.$emit("save", this.inputValue);
    },
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 20px;
  margin-bottom: 15px;
}

.modal-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 16px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.modal-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-button:hover {
  background-color: #e0e0e0;
}

.modal-button.save {
  background-color: #4caf50;
  color: white;
}

.modal-button.save:hover {
  background-color: #45a049;
}
</style>
