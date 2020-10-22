import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import axios from 'axios'

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  size: string
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: true,
    withoutAnimation: false
  }

  public device = DeviceType.Desktop
  public size = "mini"
  public baseApi = ""

  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
    /* if (this.sidebar.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    } */
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
    //setSidebarStatus('closed')
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device
  }

  @Mutation
  private SET_SIZE(size: string) {
    this.size = size
    //setSize(this.size)
  }

  @Mutation
  private SET_BASEAPI(baseApi: string) {
    this.baseApi = baseApi
  }

  @Action
  public ToggleSideBar(withoutAnimation: boolean) {
    this.TOGGLE_SIDEBAR(withoutAnimation)
  }

  @Action
  public CloseSideBar(withoutAnimation: boolean) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  }

  @Action
  public ToggleDevice(device: DeviceType) {
    this.TOGGLE_DEVICE(device)
  }

  @Action
  public SetSize(size: string) {
    this.SET_SIZE(size)
  }

  @Action
  public SetBaseApi(baseApi: string) {
    this.SET_BASEAPI(baseApi)
  }
  @Action
  public async GetBaseApi() {
    let config = await axios.get("./config.json");
    if (config.status === 200) {
      let { base_api } = config.data;
      if (base_api) {
        this.SET_BASEAPI(base_api)
      } else {
        console.error("base_api配置无效！");
      }
    } else {
      console.error("获取配置失败！");
    }
  }
}

export const AppModule = getModule(App)
