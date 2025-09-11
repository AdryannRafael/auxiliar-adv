import { ref } from "vue";
import { documentService } from "../services/api";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export const useDocumentUpload = () => {
  const uploadState = ref<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const executar = async (
    numeroProcesso: string,
    modelo: File,
    files: File[]
  ) => {
    uploadState.value.isUploading = true;
    uploadState.value.progress = 0;
    uploadState.value.error = null;

    try {
      const onUploadProgress = (progressEvent: any) => {
        if (progressEvent.total) {
          uploadState.value.progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        }
      };

      const blob = await documentService.executar(
        numeroProcesso,
        modelo,
        files,
        onUploadProgress
      );

      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${numeroProcesso}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error: any) {
      uploadState.value.error = error.message;
      return { success: false, error: error.message };
    } finally {
      uploadState.value.isUploading = false;
    }
  };

  const resetState = () => {
    uploadState.value = {
      isUploading: false,
      progress: 0,
      error: null,
    };
  };

  return {
    uploadState,
    executar,
    resetState,
  };
};
