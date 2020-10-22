import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import router, { resetRouter } from '@/router'
import { TagsViewModule } from './tags-view'
import store from '@/store'
import { login, loginOut, getUserInfo } from '@/api/app'
import { EErrCode } from '@/utils/errCode'
import { IResMsg } from '@/interface/common'
import { PermissionModule } from './permission'
export interface IUserState {
  userName: string
  roles: string[]
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public userName = ''
  public roles: string[] = []

  @Mutation
  private SET_USERNAME(userName: string) {
    this.userName = userName
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles;
    if (roles.length) {
      PermissionModule.GenerateRoutes(roles)
      router.addRoutes(PermissionModule.dynamicRoutes)
    }
  }

  @Action
  public async Login(userInfo: { userName: string, password: string }) {
    let { userName, password } = userInfo
    userName = userName.trim()
    await login({ userName, password }) as any;
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
    const { roles, userName } = msg

    this.SET_ROLES(roles)
    this.SET_USERNAME(userName)
  }

  @Action
  public async LogOut() {
    await loginOut();
    resetRouter();
    TagsViewModule.delAllViews();
    this.SET_ROLES([]);
    this.SET_USERNAME("");
  }

  @Action
  public async ResetName() {
    this.SET_USERNAME("")
  }
}

export const UserModule = getModule(User)
