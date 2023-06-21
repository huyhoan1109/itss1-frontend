import axios, { AxiosError, AxiosInstance } from "axios"

const Api: AxiosInstance = axios.create({
    baseURL: "http://localhost:5050",
    timeout: 10000,
    headers: {},
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