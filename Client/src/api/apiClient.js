import { API_BASE_URL } from "./api.js";

const apiClient = async (endpoint, options = {}) => {

    const config = {
        credentials: "include", 
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    };

    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, config);

        let data;

        try {
            data = await res.json();
        } catch {
            throw new Error("Invalid JSON from server");
        }

        // 🔥 fetch DOES NOT throw for 400/500
        if (!res.ok) {
            throw data;
        }

        return data;

    } catch (error) {
        console.error("API ERROR:", error);
        throw error;
    }
};

export default apiClient;





