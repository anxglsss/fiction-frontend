import axios from 'axios'

const baseURL = import.meta.env.DEV ? 'http://localhost:8080/api' : '/api'
const instance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.error || err.response?.data?.message
    const message = msg || (err.response?.status === 404 ? 'Not found' : err.message || 'Request failed')
    return Promise.reject(new Error(message))
  }
)

export default instance
