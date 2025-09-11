<template>
  <div>
    <div
      @click="triggerInput"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop($event)"
      :class="{ 'border-blue-400 bg-blue-50': dragOver }"
      class="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer transition-all duration-200"
    >
      <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload($event)"
        accept=".docx,.doc"
        class="hidden"
      />
      <div class="flex flex-col items-center justify-center space-y-3 py-4">
        <i class="fas fa-cloud-upload-alt text-3xl text-blue-500"></i>
        <p class="text-gray-700 font-medium">
          Clique ou arraste o arquivo modelo
        </p>
        <p class="text-sm text-gray-500">Arquivos DOCX ou DOC</p>
      </div>
    </div>
    <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["fileUploaded"]);
const error = ref<string>("");
const dragOver = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const triggerInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  // Validação de tipo de arquivo
  if (!file.name.endsWith(".docx") && !file.name.endsWith(".doc")) {
    error.value = "Apenas arquivos DOCX/DOC são permitidos.";
    return;
  }

  error.value = "";
  emit("fileUploaded", file);
};

const handleDrop = (event: DragEvent) => {
  dragOver.value = false;
  if (!event.dataTransfer) return;

  const file = event.dataTransfer.files[0];
  if (!file) return;

  // Validação de tipo de arquivo
  if (!file.name.endsWith(".docx") && !file.name.endsWith(".doc")) {
    error.value = "Apenas arquivos DOCX/DOC são permitidos.";
    return;
  }

  error.value = "";
  emit("fileUploaded", file);
};
</script>
