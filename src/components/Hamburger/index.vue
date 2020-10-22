<template>
  <div :class="[{'is-active': isActive}]" @click="toggleClick">
    <i class="el-icon-d-arrow-left"></i>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "Hamburger"
})
export default class extends Vue {
  @Prop({ default: false }) private isActive!: boolean;

  private toggleClick() {
    this.$emit("toggleClick");
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  vertical-align: middle;
}

.is-active {
  transform: rotate(180deg);
}
</style>
