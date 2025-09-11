<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Cabeçalho -->
    <header class="bg-red-600 shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <i class="fas fa-scale-balanced text-white text-2xl"></i>
            <h1 class="text-xl font-bold text-white">Auxiliar de Adv</h1>
          </div>
          <nav class="hidden md:flex space-x-6 items-center">
            <a href="#" class="text-white hover:text-red-200">Início</a>
            <a href="#" class="text-white hover:text-red-200">Ferramentas</a>
            <a href="#" class="text-white hover:text-red-200">Sobre</a>
          </nav>
          <div class="md:hidden flex items-center">
            <button
              @click="resetApp"
              class="bg-white text-red-600 hover:bg-red-50 font-medium py-2 px-3 rounded-lg transition duration-200 mr-3"
              title="Limpar Tudo"
            >
              <i class="fas fa-broom"></i>
            </button>
            <button class="text-white">
              <i class="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Conteúdo Principal -->
    <main class="flex-grow container mx-auto px-4 py-8">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-gray-800 mb-3">Gerador de RPV's</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Faça upload de um documento modelo da RPV's e a lista dos cálculos.
          Suporte para arquivos DOCX e DOC.
        </p>
      </div>

      <!-- Input do número do processo -->
      <ProcessoInput v-model="numeroProcesso" ref="processoInputRef" />

      <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <!-- Upload do Modelo -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center mb-5">
            <div class="bg-red-100 p-2 rounded-lg mr-3">
              <i class="fas fa-clipboard-list text-red-600 text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">Modelo da RPV's</h3>
          </div>

          <FileUpload @fileUploaded="handleModelUploaded" />

          <!-- Exibição do modelo selecionado -->
          <div v-if="modelFile" class="mt-5">
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-md font-medium text-gray-700">
                Modelo selecionado:
              </h4>
              <button
                @click="removeModelFile"
                class="text-red-500 text-sm hover:text-red-700"
              >
                Remover
              </button>
            </div>
            <div class="flex items-center bg-red-50 rounded-lg p-3">
              <div class="bg-white p-2 rounded-lg mr-3 shadow-sm">
                <i class="fas fa-file-word text-red-600"></i>
              </div>
              <div class="truncate">
                <p class="font-medium text-gray-800 text-sm truncate">
                  {{ modelFile.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ formatFileSize(modelFile.size) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload Múltiplo -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center mb-5">
            <div class="bg-red-100 p-2 rounded-lg mr-3">
              <i class="fas fa-copy text-red-600 text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">
              Lista de Documentos
            </h3>
          </div>

          <MultiFileUpload @filesUploaded="handleFilesUploaded" />

          <!-- Controles para documentos -->
          <div v-if="files.length > 0" class="mt-5">
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-md font-medium text-gray-700">
                Documentos selecionados ({{ files.length }}):
              </h4>
              <button
                @click="clearAllFiles"
                class="text-red-500 text-sm hover:text-red-700"
              >
                Remover todos
              </button>
            </div>

            <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
              <div
                v-for="(file, index) in files"
                :key="index"
                class="flex items-center justify-between bg-gray-50 rounded-lg p-3"
              >
                <div class="flex items-center truncate">
                  <div
                    class="bg-white p-2 rounded-lg mr-3 flex-shrink-0 shadow-sm"
                  >
                    <i class="fas fa-file-word text-red-600"></i>
                  </div>
                  <div class="truncate">
                    <p class="font-medium text-gray-800 text-sm truncate">
                      {{ file.name }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ formatFileSize(file.size) }}
                    </p>
                  </div>
                </div>
                <button
                  @click="removeFile(index)"
                  class="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progresso do Upload -->
      <div v-if="uploadState.isUploading" class="max-w-2xl mx-auto mt-8">
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Processando documentos...
          </h3>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-red-600 h-2.5 rounded-full transition-all duration-300"
              :style="{ width: uploadState.progress + '%' }"
            ></div>
          </div>
          <p class="text-center text-gray-600 mt-2">
            {{ uploadState.progress }}% concluído
          </p>
        </div>
      </div>

      <!-- Mensagem de Erro -->
      <div v-if="uploadState.error" class="max-w-2xl mx-auto mt-8">
        <div class="bg-red-50 border border-red-200 rounded-xl p-6">
          <div class="flex items-center mb-3">
            <i class="fas fa-exclamation-circle text-red-600 mr-2"></i>
            <h3 class="text-lg font-semibold text-red-800">
              Erro no processamento
            </h3>
          </div>
          <p class="text-red-700">{{ uploadState.error }}</p>
          <button
            @click="uploadState.error = null"
            class="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Entendido
          </button>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="text-center mt-10 space-x-4">
        <button
          @click="resetApp"
          class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 inline-flex items-center"
        >
          <i class="fas fa-broom mr-2"></i>
          Limpar Tudo
        </button>
        <button
          @click="processFiles"
          :disabled="
            files.length === 0 || !modelFile || uploadState.isUploading
          "
          :class="{
            'opacity-50 cursor-not-allowed':
              files.length === 0 || !modelFile || uploadState.isUploading,
          }"
          class="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 inline-flex items-center"
        >
          <i class="fas fa-file-arrow-down mr-2"></i>
          {{ uploadState.isUploading ? "Processando..." : "Gerar RPV's" }}
        </button>
      </div>
    </main>

    <!-- Rodapé -->
    <footer class="bg-white border-t mt-10">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center mb-4 md:mb-0">
            <i class="fas fa-file-word text-red-600 text-xl mr-2"></i>
            <span class="text-gray-700 font-medium">Auxiliar de Adv</span>
          </div>
          <div class="text-gray-600 text-sm">
            &copy; 2025 Auxiliar de Adv. Todos os direitos reservados. Feito com
            carinho pra <span class="text-red-600">Elaynne de Cassia</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FileUpload from "./components/FileUpload.vue";
import MultiFileUpload from "./components/MultiFileUpload.vue";
import ProcessoInput from "./components/ProcessoInput.vue";
import { useDocumentUpload } from "./composables/useDocumentUpload";

// Refs para os estados
const files = ref<File[]>([]);
const modelFile = ref<File | null>(null);
const numeroProcesso = ref("");
const processoInputRef = ref();

// Hook para upload
const { uploadState, executar, resetState } = useDocumentUpload();

// Manipulador para quando um modelo é enviado
const handleModelUploaded = (file: File) => {
  modelFile.value = file;
};

// Manipulador para quando arquivos são enviados
const handleFilesUploaded = (uploadedFiles: File[]) => {
  files.value = uploadedFiles;
};

// Remover arquivo individual
const removeFile = (index: number) => {
  files.value.splice(index, 1);
};

// Remover todos os arquivos
const clearAllFiles = () => {
  files.value = [];
};

// Remover arquivo modelo
const removeModelFile = () => {
  modelFile.value = null;
};

// Resetar toda a aplicação para o estado inicial
const resetApp = () => {
  files.value = [];
  modelFile.value = null;
  numeroProcesso.value = "";
  resetState();
};

// Formatador de tamanho de arquivo
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Processar arquivos
const processFiles = async () => {
  if (!processoInputRef.value?.validate()) {
    alert("Por favor, informe um número de processo válido.");
    return;
  }

  if (files.value.length === 0 || !modelFile.value) {
    alert("Por favor, selecione pelo menos um documento e um modelo.");
    return;
  }

  const result = await executar(
    numeroProcesso.value,
    modelFile.value,
    files.value
  );

  if (result.success) {
    // Opcional: resetar o app após sucesso
    resetApp();
  }
};
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

/* Estilos personalizados para scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
