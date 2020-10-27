import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import router, { resetRouter, asyncRoutes } from '@/router'
import { TagsViewModule } from './tags-view'
import store from '@/store'
import { loginOut, getUserInfo } from '@/api/app'
import { EErrCode } from '@/utils/errCode'
import { IResMsg } from '@/interface/common'
import { PermissionModule } from './permission'
import { RouteConfig } from 'vue-router'
export interface IPower {
  children?: IPower[],
  meta: {
    title: string,
    hidden?: boolean,
    apis?: {
      api: string,
      desc: string,
      enable?: boolean,
      name: string
    }[]
  },
  name: string
}
export interface IUserState {
  userName: string
  roles: string[],
  power: IPower[]
}
const generatePower = (routes: RouteConfig[]) => {
  let arr = [];
  for (let i = 0; i < routes.length; i++) {
    let item = { ...routes[i] };
    if (item.name) {
      let nRoute: IPower = {
        name: item.name as string,
        meta: item.meta
      }
      if (item.children) {
        nRoute.children = generatePower(item.children)
      }
      arr.push(nRoute)
    }
  }
  return arr;
}
@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public userName = ''
  public roles: string[] = []
  public power: IPower[] = []

  @Mutation
  private SET_USERNAME(userName: string) {
    this.userName = userName
  }

  @Mutation
  private SET_POWER(power: IPower[]) {
    this.power = power
    if (power.length) {
      PermissionModule.GenerateRoutes(power)
      router.addRoutes(PermissionModule.dynamicRoutes)
    }
  }

  @Action
  public async GetUserInfo() {
    if (this.userName !== "") {
      return;
    }
    const { code, msg }: IResMsg = await getUserInfo() as any;
    if (code !== EErrCode.OK) {
      console.error("获取用户信息失败")
      return;
    }
    const { userName, power } = msg
    this.SET_USERNAME(userName);
    if (userName === "admin") {
      this.SET_POWER(generatePower(asyncRoutes))
    } else {
      this.SET_POWER(power)
    }
  }

  @Action
  public async LogOut() {
    await loginOut();
    resetRouter();
    TagsViewModule.delAllViews();
    this.SET_USERNAME("");
  }

  @Action
  public ResetName() {
    this.SET_USERNAME("")
  }

  @Action
  public SetPower(power: IPower[]) {
    this.SET_POWER(power)
  }
}

export const UserModule = getModule(User)
