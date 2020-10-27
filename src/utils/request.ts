import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { AppModule } from "@/store/modules/app";
import { EErrCode } from './errCode';
import { UserModule } from '@/store/modules/user';
import router from '@/router';

const service = axios.create({
  baseURL: AppModule.baseApi, // url = base url + request url
  timeout: 5000,
  withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  async (config) => {
    if (AppModule.baseApi === "") {
      await AppModule.GetBaseApi();
    }
    config.baseURL = AppModule.baseApi;
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === EErrCode.NoLogin) {
      MessageBox.confirm(
        '你已被登出，可以取消继续留在该页面，或者重新登录',
        '确定登出',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        UserModule.ResetName();
        router.push("/login") // To prevent bugs from vue-router
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response.data
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
