/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react"
import axios from "axios"

const instance = axios.create({
  timeout: 60000,
  baseURL: "https://api.starlink.bot/"
})
// 请求拦截
instance.interceptors.request.use(
  config => {
    config.data = JSON.stringify(config.data)
    config.headers = {
      "Content-Type": "application/json",
    }
    return config
  }, 
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截
instance.interceptors.response.use(
  res => {
    if (res.status === 200) {
      let response = res.data
      if (response.code === 0) {
        return response.data
      }  else {
        return Promise.reject(response)
      }
    } else {
      return Promise.reject(res.statusText)
    }
  }, 
  error => {
    return Promise.reject(error)
  }
)
// 请求方法
export const post = function post(url, params = {}) {
  return new Promise((resolve, reject) => {
    instance.post(url,params).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
export const get = function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    instance.get(url, { params }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
export const useRequest = (url, params={}) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const request = async (_url, _params={}) => {
    try {
      setLoading(true)
      const resp = await post(_url, _params)
      setLoading(false)
      setData(resp)
      return resp
    } catch (error) {
      setError(error)
      setLoading(false)
      return {
        error: true,
        code: error.code,
        desc: error.message
      }
    }
  }


  useEffect(() => {
    !!url && request(url, params)
  }, [url])

  return {
    data, loading, error, 
    request
  }
}
