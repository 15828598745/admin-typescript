<template>
  <div class="login-container">
    <three-bg class="bg-anim" />
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">
          系统登录
        </h3>
      </div>
      <el-form-item prop="userName">
        <span class="svg-container">
          <i class="el-icon-user" />
        </span>
        <el-input ref="userName" v-model="loginForm.userName" placeholder="账号" name="userName" type="text" tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="pwd">
          <span class="svg-container">
            <i class="el-icon-lock" />
          </span>
          <el-input :key="pwdType" ref="pwd" v-model="loginForm.pwd" :type="pwdType" placeholder="密码" name="pwd" tabindex="2" autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false" @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <i class="el-icon-view" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%; margin-bottom:30px;" @click.native.prevent="handleLogin">
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { Dictionary } from "vue-router/types/router";
import { Form as ElForm, Input } from "element-ui";
import { isValidUsername } from "@/utils/validate";
import threeBg from "../../components/3DBG/index.vue";
import { login } from "../../api/app";
import { EErrCode } from "../../utils/errCode";

@Component({
  name: "Login",
  components: {
    threeBg
  }
})
export default class extends Vue {
  private validateUsername = (rule: any, value: string, callback: Function) => {
    if (!isValidUsername(value)) {
      callback(new Error("账号不能小于位"));
    } else {
      callback();
    }
  };

  private validatepwd = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error("密码不能小于6位"));
    } else {
      callback();
    }
  };

  private loginForm = {
    userName: "admin",
    pwd: "123456"
  };

  private loginRules = {
    userName: [{ validator: this.validateUsername, trigger: "blur" }],
    pwd: [{ validator: this.validatepwd, trigger: "blur" }]
  };

  private pwdType = "pwd";
  private loading = false;
  private showDialog = false;
  private capsTooltip = false;
  private redirect?: string;
  private otherQuery: Dictionary<string> = {};

  @Watch("$route", { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>;
    if (query) {
      this.redirect = query.redirect;
      this.otherQuery = this.getOtherQuery(query);
    }
  }

  mounted() {
    if (this.loginForm.userName === "") {
      (this.$refs.userName as Input).focus();
    } else if (this.loginForm.pwd === "") {
      (this.$refs.pwd as Input).focus();
    }
  }

  private checkCapslock(e: KeyboardEvent) {
    const { key } = e;
    this.capsTooltip =
      key !== null && key.length === 1 && key >= "A" && key <= "Z";
  }

  private showPwd() {
    if (this.pwdType === "pwd") {
      this.pwdType = "";
    } else {
      this.pwdType = "pwd";
    }
    this.$nextTick(() => {
      (this.$refs.pwd as Input).focus();
    });
  }

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true;
        let ret = await login(this.loginForm);
        if (ret.code !== EErrCode.OK) {
          this.$message.error(ret.msg);
          this.loading = false;
          return;
        }
        this.$router.push({
          path: this.redirect || "/",
          query: this.otherQuery
        });
        this.loading = false;
      } else {
        return false;
      }
    });
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== "redirect") {
        acc[cur] = query[cur];
      }
      return acc;
    }, {} as Dictionary<string>);
  }
}
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input {
      color: $loginCursorColor;
    }
    input::first-line {
      color: $lightGray;
    }
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $lightGray;
      caret-color: $loginCursorColor;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $loginBg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;
  position: relative;
  .bg-anim {
    position: absolute;
    top: 0;
    left: 0;
  }
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
