import service from '@/utils/request'
import { AxiosRequestConfig } from 'axios'
import { IResMsg } from '@/interface/common'

export const getUserList = (data: any): Promise<IResMsg> => {
  return service.post("/api/getUserList", data)
}
export const addUser = (data: any): Promise<IResMsg> => {
  return service.post("/api/addUser", data)
}
export const updateUser = (data: any): Promise<IResMsg> => {
  return service.post("/api/updateUser", data)
}
export const delUser = (data: any): Promise<IResMsg> => {
  return service.post("/api/delUser", data)
}