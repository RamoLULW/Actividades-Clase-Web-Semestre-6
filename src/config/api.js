export const API_URL = "http://localhost:8000";

export const createAuthHeaders = (token, includeJson = false) => {
    const headers = {};

    if (includeJson) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
};
