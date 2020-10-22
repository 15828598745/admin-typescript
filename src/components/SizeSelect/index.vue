<template>
  <el-dropdown id="size-select" trigger="click" @command="handleSetSize">
    <i class="el-icon-menu"/>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :command="item.value">
        {{item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AppModule } from "@/store/modules/app";
import { TagsViewModule } from "@/store/modules/tags-view";

@Component({
  name: "SizeSelect"
})
export default class extends Vue {
  private sizeOptions = [
    { label: "默认", value: "default" },
    { label: "中号", value: "medium" },
    { label: "小号", value: "small" },
    { label: "微小", value: "mini" }
  ];

  get size() {
    return AppModule.size;
  }

  private handleSetSize(size: string) {
    (this as any).$ELEMENT.size = size;
    AppModule.SetSize(size);
    this.refreshView();
    this.$message({
      message: "Switch Size Success",
      type: "success"
    });
  }

  private refreshView() {
    // In order to make the cached page re-rendered
    TagsViewModule.delAllCachedViews();
    const { fullPath } = this.$route;
    this.$nextTick(() => {
      this.$router.replace({
        path: "/redirect" + fullPath
      });
    });
  }
}
</script>
