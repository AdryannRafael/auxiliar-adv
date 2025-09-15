import axios, { type AxiosProgressEvent } from "axios";

// Configuração base do axios
const api = axios.create({
  baseURL: "https://julius.adryannrafael.online/docx-server", // Altere para a URL do seu backend
  // baseURL: "http://localhost:8080", // Altere para a URL do seu backend
  timeout: 30000, // 30 segundos timeout para uploads
});

// Interface para o response
export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Serviço para upload de documentos
export const documentService = {
  async executar(
    numeroProcesso: string,
    modelo: File,
    files: File[],
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<Blob> {
    const formData = new FormData();

    // Adiciona o número do processo
    formData.append("numeroProcesso", numeroProcesso);

    // Adiciona o modelo (arquivo único)
    formData.append("modelo", modelo);

    // Adiciona os arquivos (múltiplos)
    files.forEach((file, index) => {
      formData.append("file", file);
    });

    try {
      const response = await api.post("/executar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // Importante para receber arquivos
        onUploadProgress,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Erro ao processar documentos"
      );
    }
  },
};

export default api;
