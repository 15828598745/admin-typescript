import router from "./router"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { Message } from "element-ui"
import { Route } from "vue-router"
import { UserModule } from "@/store/modules/user"
import { PermissionModule } from "@/store/modules/permission"

NProgress.configure({ showSpinner: false })

const whiteList = ["/login", "/auth-redirect"]

router.beforeEach(async (to: Route, _: Route, next: any) => {
  NProgress.start()
  if (UserModule.userName !== "") {
    if (to.path === "/login") {
      next({ path: "/" })
      NProgress.done()
    } else {
      next();
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      await UserModule.GetUserInfo()
      const roles = UserModule.roles
      PermissionModule.GenerateRoutes(roles)
      router.addRoutes(PermissionModule.dynamicRoutes)
      next({ ...to, replace: true })
      NProgress.done()
    }
  }
})

router.afterEach((to: Route) => {
  NProgress.done();
})
