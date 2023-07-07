import axios, { AxiosError, AxiosInstance } from "axios"

const Api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    timeout: 60000
})

Api.interceptors.request.use((config) => {
    return config
})

Api.interceptors.response.use(
    (response) => {
      return Promise.resolve(response)
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
)

export {
  Api
}