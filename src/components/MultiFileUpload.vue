<template>
  <div>
    <div
      @click="triggerInput"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop($event)"
      :class="{ 'border-fuchsia-400 bg-fuchsia-50': dragOver }"
      class="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer transition-all duration-200 mb-4"
    >
      <input
        id="file-upload"
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        accept=".docx,.doc"
        multiple
        class="hidden"
      />
      <div class="flex flex-col items-center justify-center space-y-3 py-4">
        <i class="fas fa-file-upload text-3xl text-fuchsia-500"></i>
        <p class="text-gray-700 font-medium">Clique ou arraste os arquivos</p>
        <p class="text-sm text-gray-500">
          {{
            files.length > 0
              ? "Adicionar mais arquivos DOCX ou DOC"
              : "Múltiplos arquivos DOCX ou DOC"
          }}
        </p>
      </div>
    </div>

    <!-- Botão para limpar seleção -->
    <div v-if="files.length > 0" class="flex justify-end mb-3">
      <button
        @click="clearAllFiles"
        class="text-fuchsia-500 text-sm hover:text-fuchsia-700 font-medium flex items-center"
      >
        <i class="fas fa-times-circle mr-1"></i>
        Limpar todos os arquivos
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { formatFileSize } from "../utils/fileHelpers";

const emit = defineEmits(["filesUploaded"]);
const files = ref<File[]>([]);
const dragOver = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const triggerInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const uploadedFiles = Array.from(target.files || []);

  const validFiles = uploadedFiles.filter(
    (file) => file.name.endsWith(".docx") || file.name.endsWith(".doc")
  );

  // Adiciona os novos arquivos à lista existente (acumulativo)
  files.value = [...files.value, ...validFiles];
  emit("filesUploaded", files.value);

  // Limpa o input para permitir seleção de novos arquivos
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleDrop = (event: DragEvent) => {
  dragOver.value = false;
  if (!event.dataTransfer) return;

  const uploadedFiles = Array.from(event.dataTransfer.files || []);

  const validFiles = uploadedFiles.filter(
    (file) => file.name.endsWith(".docx") || file.name.endsWith(".doc")
  );

  // Adiciona os novos arquivos à lista existente (acumulativo)
  files.value = [...files.value, ...validFiles];
  emit("filesUploaded", files.value);
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  emit("filesUploaded", files.value);
};

const clearAllFiles = () => {
  files.value = [];
  emit("filesUploaded", []);
};
</script>
