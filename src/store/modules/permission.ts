import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import router, { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'
import { IPower, UserModule } from './user'

const hasPermission = (power: IPower[], route: RouteConfig): boolean => {
  if (route.name) {

    for (let i = 0; i < power.length; i++) {
      let item = power[i];
      if (item.name === route.name) {
        return true;
      } else if (item.children) {
        if (hasPermission(item.children, route)) {
          return true;
        }
      }
    }
    return false;
  } else {
    return false
  }
}

export const filterAsyncRoutes = (routes: RouteConfig[], power: IPower[]) => {
  const res: RouteConfig[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(power, r) || r.path === "/") {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, power)
      }
      res.push(r)
    }
  })
  return res
}

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
    this.dynamicRoutes = routes;
  }

  @Action
  public GenerateRoutes(power: IPower[]) {
    let accessedRoutes
    if (UserModule.userName === "admin") {
      accessedRoutes = asyncRoutes
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, power)
    }
    this.SET_ROUTES(accessedRoutes)
  }
}

export const PermissionModule = getModule(Permission)
