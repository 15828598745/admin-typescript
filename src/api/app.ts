import service from '@/utils/request'
import { AxiosRequestConfig } from 'axios'
import { IResMsg } from '@/interface/common'

export const login = (data: any): Promise<IResMsg> => {
  return service.post("/api/login", data)
}
export const loginOut = (): Promise<IResMsg> => {
  return service.post("/api/loginOut")
}
export const getUserInfo = (): Promise<IResMsg> => {
  return service.post("/api/getUserInfo")
}

export const uploadChunk = (data: any): Promise<IResMsg> => {
  return service.post("/upload/uploadChunk", data)
}
export const mergeChunks = (data: any): Promise<IResMsg> => {
  return service.post("/upload/mergeChunks", data)
}
