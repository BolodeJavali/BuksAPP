import axios from 'axios'
const api = axios.create({
    baseURL: 'https://api.dicebear.com/9.x/initials/svg?seed='
});

export default api;
