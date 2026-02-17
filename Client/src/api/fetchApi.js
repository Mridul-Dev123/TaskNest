import apiClient from "./apiClient";
 const get = (url) =>
    apiClient(url, { method: "GET" });

const post = (url, body) =>
    apiClient(url, {
        method: "POST",
        body: JSON.stringify(body),
    });

const put = (url, body) =>
    apiClient(url, {
        method: "PUT",
        body: JSON.stringify(body),
    });

const patch = (url, body) =>
    apiClient(url, {
        method: "PATCH",
        body: JSON.stringify(body),
    });

const Delete = (url) =>
    apiClient(url, { method: "DELETE" });

const api={get, post, put, patch, delete:Delete};
export default api;