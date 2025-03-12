import { api } from "../api/api";

export interface GenerateQrResponse {
    message: string;
    id: number;
    url: string;
    qr_image_base64: string;
}


export const postGenerateQr = async (link: string): Promise<GenerateQrResponse | { error: string } | null> => {
    try {
        const response = await api.post<GenerateQrResponse>(`qr/create-qr-and-return-base64/`, {
            url: link
        });
        return response.data;
    } catch (error: any) {
        // console.log("Error en la API:", error.response?.data || error.message);

        if (error.response?.data?.error) {
            return { error: error.response.data.error };
        }

        return { error: "Ocurrió un error inesperado." };
    }
};
