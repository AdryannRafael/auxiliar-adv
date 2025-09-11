<template>
  <div class="mb-6">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Número do Processo *
    </label>
    <input
      v-model="numeroProcesso"
      type="text"
      placeholder="Ex: 1234567-00.0000.0.00.0000"
      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
      :class="{ 'border-red-500': error }"
    />
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    <p class="text-gray-500 text-sm mt-1">
      Informe o número completo do processo conforme o padrão do tribunal
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from "vue";

const emit = defineEmits(["update:modelValue"]);
const numeroProcesso = ref("");
const error = ref("");

watch(numeroProcesso, (value) => {
  emit("update:modelValue", value);
  validateProcesso(value);
});

const validateProcesso = (value: string) => {
  if (!value.trim()) {
    error.value = "O número do processo é obrigatório";
    return false;
  }

  if (value.length < 5) {
    error.value = "Número do processo muito curto";
    return false;
  }

  error.value = "";
  return true;
};

defineExpose({
  validate: () => validateProcesso(numeroProcesso.value),
  getValue: () => numeroProcesso.value,
});
</script>
