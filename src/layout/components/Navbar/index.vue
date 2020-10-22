<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <header-search class="right-menu-item" />
        <error-log class="errLog-container right-menu-item hover-effect" />
        <screenfull class="right-menu-item hover-effect" />
        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <el-tooltip content="退出" effect="dark" placement="bottom">
        <div class="right-menu-item" @click="logout">
          <i class="el-icon-switch-button" />
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AppModule } from "@/store/modules/app";
import { UserModule } from "@/store/modules/user";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import ErrorLog from "@/components/ErrorLog/index.vue";
import Hamburger from "@/components/Hamburger/index.vue";
import HeaderSearch from "@/components/HeaderSearch/index.vue";
import Screenfull from "@/components/Screenfull/index.vue";
import SizeSelect from "@/components/SizeSelect/index.vue";
import wenGif from "@/assets/images/wen.gif";

@Component({
  name: "Navbar",
  components: {
    Breadcrumb,
    ErrorLog,
    Hamburger,
    HeaderSearch,
    Screenfull,
    SizeSelect
  }
})
export default class extends Vue {
  private wenGif = wenGif;
  get sidebar() {
    return AppModule.sidebar;
  }

  get device() {
    return AppModule.device.toString();
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false);
  }

  private async logout() {
    await UserModule.LogOut();
    this.$router.push("/login");
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    line-height: 50px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
