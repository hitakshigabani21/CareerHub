import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const path = window.location.pathname;
    const publicPath = path === '/' || path === '/login' || path === '/register';
    if (status === 401 && !publicPath) {
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error, fallback = 'Something went wrong') {
  return error.response?.data?.message || error.message || fallback;
}

function saveBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

async function ensureBlobOk(blob, fallback) {
  const type = blob.type || '';
  if (type.includes('application/json')) {
    const text = await blob.text();
    const parsed = JSON.parse(text);
    throw new Error(parsed.message || fallback);
  }
  return blob;
}

export async function downloadBlob(path, filename, data) {
  const response = await api.post(path, data, { responseType: 'blob' });
  saveBlob(await ensureBlobOk(response.data, 'Download failed'), filename);
}

export async function downloadFile(path, filename) {
  const response = await api.get(path, { responseType: 'blob' });
  saveBlob(await ensureBlobOk(response.data, 'Download failed'), filename);
}

export default api;
