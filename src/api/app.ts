import service from '@/utils/request'


export const login = (data: any) => {
  return service.post("/api/login",data)
}
export const loginOut = () => {
  return service.post("/api/loginOut")
}
export const getUserInfo = () => {
  return service.post("/api/getUserInfo")
}
export const testApi = (data: any) => {
  return service.post("/api/test",data)
}